// migrate.js - Safe, idempotent migration script to populate Supabase site_content from data.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

function loadLocalData() {
  const filePath = path.join(__dirname, 'data.js');
  if (!fs.existsSync(filePath)) {
    throw new Error('data.js not found');
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(content + '\nthis.professorData = professorData;', context);
  return context.professorData || {};
}

function makeId(prefix, index) {
  return `${prefix}_${index + 1}`;
}

function cleanString(val) {
  return typeof val === 'string' ? val.trim() : '';
}

function normalizeTitle(str) {
  return cleanString(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function buildCanonicalData(d) {
  return {
    name: cleanString(d.name) || 'Dr. Yun-Hao Dong',
    title: cleanString(d.title) || 'Senior Lecturer',
    department: cleanString(d.department) || 'Department of Construction and Quality Management',
    university: cleanString(d.university) || 'Hong Kong Metropolitan University',
    shortDescription: cleanString(d.shortDescription) || '',
    profileImage: cleanString(d.profileImage) || 'images/profile.jpg',
    about: Array.isArray(d.about) ? d.about : (d.about ? [d.about] : []),
    memberships: (d.memberships || []).map((m, i) => ({
      id: (m && m.id) || makeId('mem', i),
      title: typeof m === 'string' ? m : (m.title || '')
    })),
    researchInterests: (d.researchInterests || []).map((r, i) => ({
      id: (r && r.id) || makeId('res', i),
      title: cleanString(r.title),
      description: cleanString(r.description)
    })),
    publicationsFullListUrl: cleanString(d.publicationsFullListUrl) || 'https://scholars.hkmu.edu.hk/en/persons/yunhao-dong/publications/',
    publications: (d.publications || []).map((p, i) => ({
      id: (p && p.id) || makeId('pub', i),
      title: cleanString(p.title),
      authors: cleanString(p.authors),
      venue: cleanString(p.venue),
      year: cleanString(p.year),
      link: cleanString(p.link),
      description: cleanString(p.description),
      type: cleanString(p.type) || 'Journal'
    })),
    projects: (d.projects || []).map((p, i) => ({
      id: (p && p.id) || makeId('proj', i),
      title: cleanString(p.title),
      description: cleanString(p.description),
      role: cleanString(p.role) || (p.description && p.description.includes('Principal Investigator') ? 'Principal Investigator' : (p.description && p.description.includes('Co-Investigator') ? 'Co-Investigator' : '')),
      year: cleanString(p.year),
      link: cleanString(p.link)
    })),
    education: (d.education || []).map((e, i) => ({
      id: (e && e.id) || makeId('edu', i),
      degree: cleanString(e.degree),
      institution: cleanString(e.institution),
      year: cleanString(e.year),
      description: cleanString(e.description)
    })),
    awards: (d.awards || []).map((a, i) => ({
      id: (a && a.id) || makeId('award', i),
      title: cleanString(a.title),
      details: cleanString(a.details || a.description),
      year: cleanString(a.year),
      organization: cleanString(a.organization)
    })),
    academicExperience: [
      {
        id: 'exp_1',
        title: 'Senior Lecturer',
        institution: 'Hong Kong Metropolitan University',
        startYear: '2024',
        endYear: 'Present',
        description: 'Department of Construction and Quality Management'
      },
      {
        id: 'exp_2',
        title: 'Hong Kong Scholar Postdoctoral Fellow',
        institution: 'City University of Hong Kong',
        startYear: '2023',
        endYear: '2024',
        description: 'Hong Kong Scholars Program (Grant No. XJ2023059)'
      },
      {
        id: 'exp_3',
        title: 'Postdoctoral Researcher',
        institution: 'College of Civil Engineering, Tongji University',
        startYear: '2022',
        endYear: '2023',
        description: 'Postdoctoral research in Civil Engineering'
      }
    ],
    news: (d.news || []).map((n, i) => ({
      id: (n && n.id) || makeId('news', i),
      date: cleanString(n.date),
      title: cleanString(n.title),
      description: cleanString(n.description),
      link: cleanString(n.link)
    })),
    contact: {
      email: cleanString(d.contact?.email) || 'mdong@hkmu.edu.hk',
      university: cleanString(d.contact?.university) || 'Hong Kong Metropolitan University',
      office: cleanString(d.contact?.office) || '',
      googleScholar: cleanString(d.contact?.googleScholar) || 'https://scholar.google.com/citations?user=2Zh-JoYAAAAJ',
      orcid: cleanString(d.contact?.orcid) || 'https://orcid.org/0000-0003-3159-3526',
      researchGate: cleanString(d.contact?.researchGate) || '',
      linkedin: cleanString(d.contact?.linkedin) || 'https://hk.linkedin.com/in/dongyunhao',
      scopus: cleanString(d.contact?.scopus) || 'https://www.scopus.com/authid/detail.uri?authorId=57208682948',
      universityProfile: cleanString(d.contact?.universityProfile) || 'https://scholars.hkmu.edu.hk/en/persons/yunhao-dong/'
    },
    customSections: Array.isArray(d.customSections) ? d.customSections : []
  };
}

function mergeData(existingRaw, canonical) {
  if (!existingRaw || typeof existingRaw !== 'object') {
    return canonical;
  }

  const existing = existingRaw.page_data || existingRaw;
  const isDummyName = !existing.name || existing.name === 'Professor Name';

  const result = { ...canonical };

  // Profile fields: keep existing unless it was dummy
  if (!isDummyName && existing.name) result.name = existing.name;
  if (existing.title && existing.title !== 'Professor') result.title = existing.title;
  if (existing.department) result.department = existing.department;
  if (existing.university) result.university = existing.university;
  if (existing.shortDescription) result.shortDescription = existing.shortDescription;
  if (existing.profileImage) result.profileImage = existing.profileImage;
  if (Array.isArray(existing.about) && existing.about.length > 0 && existing.about.some(p => p.trim() !== '')) {
    result.about = existing.about;
  }
  if (existing.publicationsFullListUrl) result.publicationsFullListUrl = existing.publicationsFullListUrl;

  // Contact fields
  const exContact = existing.contact || {};
  result.contact = {
    ...canonical.contact,
    ...Object.fromEntries(Object.entries(exContact).filter(([_, v]) => typeof v === 'string' && v.trim() !== ''))
  };

  // Helper to merge lists idempotently:
  // Prefer existing if present, append canonical items that don't already exist
  function mergeArray(canonicalList, existingList, matchFn) {
    if (!Array.isArray(existingList) || existingList.length === 0) {
      return canonicalList;
    }
    const merged = [...existingList];
    canonicalList.forEach((canItem) => {
      const alreadyExists = merged.some((exItem) => matchFn(exItem, canItem));
      if (!alreadyExists) {
        merged.push(canItem);
      }
    });
    // Ensure all have stable IDs
    return merged.map((item, idx) => ({
      ...item,
      id: item.id || `id_${idx + 1}`
    }));
  }

  result.publications = mergeArray(
    canonical.publications,
    existing.publications,
    (a, b) => (a.link && b.link && a.link === b.link) || (normalizeTitle(a.title) === normalizeTitle(b.title)) || (a.id && b.id && a.id === b.id)
  );

  result.projects = mergeArray(
    canonical.projects,
    existing.projects,
    (a, b) => normalizeTitle(a.title) === normalizeTitle(b.title) || (a.id && b.id && a.id === b.id)
  );

  result.researchInterests = mergeArray(
    canonical.researchInterests,
    existing.researchInterests,
    (a, b) => normalizeTitle(a.title) === normalizeTitle(b.title) || (a.id && b.id && a.id === b.id)
  );

  result.education = mergeArray(
    canonical.education,
    existing.education,
    (a, b) => normalizeTitle(a.degree) === normalizeTitle(b.degree) || (a.id && b.id && a.id === b.id)
  );

  result.awards = mergeArray(
    canonical.awards,
    existing.awards,
    (a, b) => normalizeTitle(a.title) === normalizeTitle(b.title) || (a.id && b.id && a.id === b.id)
  );

  result.academicExperience = mergeArray(
    canonical.academicExperience,
    existing.academicExperience,
    (a, b) => normalizeTitle(a.title + a.institution) === normalizeTitle(b.title + b.institution) || (a.id && b.id && a.id === b.id)
  );

  result.news = mergeArray(
    canonical.news,
    existing.news,
    (a, b) => normalizeTitle(a.title) === normalizeTitle(b.title) || (a.id && b.id && a.id === b.id)
  );

  result.memberships = mergeArray(
    canonical.memberships,
    (existing.memberships || []).map((m, i) => typeof m === 'string' ? { id: `mem_${i+1}`, title: m } : m),
    (a, b) => normalizeTitle(a.title) === normalizeTitle(b.title) || (a.id && b.id && a.id === b.id)
  );

  result.customSections = Array.isArray(existing.customSections) && existing.customSections.length > 0
    ? existing.customSections.map((c, i) => ({ ...c, id: c.id || `custom_${i+1}` }))
    : canonical.customSections;

  return result;
}

function runMigration() {
  const localData = loadLocalData();
  const canonical = buildCanonicalData(localData);

  console.log('Fetching current site_content record from Supabase...');
  let existing = null;

  try {
    const rawOut = execSync('supabase db query --linked "SELECT page_data FROM site_content WHERE id = \'main\';"', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    // Parse supabase JSON output
    const jsonStart = rawOut.indexOf('{');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(rawOut.substring(jsonStart));
      if (parsed.rows && parsed.rows.length > 0) {
        existing = parsed.rows[0].page_data;
      }
    }
  } catch (err) {
    console.warn('Could not query current db record directly; merging with canonical defaults.');
  }

  const merged = mergeData(existing, canonical);

  console.log(`Prepared merged data:`);
  console.log(`- Name: ${merged.name}`);
  console.log(`- Publications: ${merged.publications.length} items`);
  console.log(`- Projects: ${merged.projects.length} items`);
  console.log(`- Research Interests: ${merged.researchInterests.length} items`);
  console.log(`- Education: ${merged.education.length} items`);
  console.log(`- Awards: ${merged.awards.length} items`);
  console.log(`- Academic Experience: ${merged.academicExperience.length} items`);
  console.log(`- News: ${merged.news.length} items`);
  console.log(`- Memberships: ${merged.memberships.length} items`);

  // Write JSON to a temporary SQL query file to execute safely
  const jsonStr = JSON.stringify(merged).replace(/'/g, "''");
  const sql = `
INSERT INTO public.site_content (id, page_data, updated_at)
VALUES ('main', '${jsonStr}'::jsonb, now())
ON CONFLICT (id) DO UPDATE
SET page_data = EXCLUDED.page_data,
    updated_at = now();
`;

  fs.writeFileSync('temp_migration.sql', sql, 'utf8');
  console.log('Executing migration query in Supabase...');
  try {
    execSync('supabase db query --linked -f temp_migration.sql', { stdio: 'inherit' });
    console.log('Migration successfully applied to Supabase!');
  } finally {
    if (fs.existsSync('temp_migration.sql')) {
      fs.unlinkSync('temp_migration.sql');
    }
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { loadLocalData, buildCanonicalData, mergeData };

