/**
 * admin.js - Full-featured, robust Supabase Content Management Dashboard
 * for Professor Dr. Yun-Hao Dong
 */

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const messageBox = document.getElementById('status-message');
const logoutButton = document.getElementById('logout-button');
const saveAllButton = document.getElementById('save-all-button');
const uploadImageButton = document.getElementById('upload-image-button');
const removeImageButton = document.getElementById('remove-image-button');
const profileImageInput = document.getElementById('profileImageInput');
const profileImageField = document.getElementById('profileImage');
const profileImagePreview = document.getElementById('profileImagePreview');

let currentData = null;
let statusTimeout = null;
let loadFailed = false; // blocks saving if the DB could not be read (prevents overwriting it with defaults)

function showMessage(text, type = 'success', duration = 4000) {
  if (!messageBox) return;

  if (statusTimeout) {
    clearTimeout(statusTimeout);
    statusTimeout = null;
  }

  messageBox.textContent = text;
  messageBox.className = `status-message visible ${type}`;

  if (duration && type !== 'error') {
    statusTimeout = setTimeout(() => {
      messageBox.className = 'status-message';
      messageBox.textContent = '';
    }, duration);
  }
}

function showLoading(show, message = 'Loading content from Supabase...') {
  if (!loadingIndicator) return;
  if (show) {
    loadingIndicator.style.display = 'flex';
    const textEl = loadingIndicator.querySelector('span');
    if (textEl) textEl.textContent = message;
  } else {
    loadingIndicator.style.display = 'none';
  }
}

// ==============================================================================
// 2. Data Normalization & Default Data
// ==============================================================================

function generateId(prefix = 'item') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function parseYearValue(value) {
  if (!value) return 0;
  const match = String(value).match(/(\d{4})/);
  return match ? Number(match[1]) : 0;
}

function sortByYearDesc(items) {
  if (!Array.isArray(items)) return [];
  return items.slice().sort((a, b) => {
    const bYear = parseYearValue(b.year || b.date || b.startYear || b.endYear);
    const aYear = parseYearValue(a.year || a.date || a.startYear || a.endYear);
    return bYear - aYear;
  });
}

function getDefaultData() {
  const p = typeof professorData !== 'undefined' ? professorData : {};

  return {
    name: p.name || 'Dr. Yun-Hao Dong',
    title: p.title || 'Senior Lecturer',
    department: p.department || 'Department of Construction and Quality Management',
    university: p.university || 'Hong Kong Metropolitan University',
    shortDescription: p.shortDescription || '',
    profileImage: p.profileImage || 'images/profile.jpg',
    about: Array.isArray(p.about) ? p.about : (p.about ? [p.about] : []),
    publicationsFullListUrl: p.publicationsFullListUrl || 'https://scholars.hkmu.edu.hk/en/persons/yunhao-dong/publications/',
    contact: {
      email: p.contact?.email || 'mdong@hkmu.edu.hk',
      university: p.contact?.university || 'Hong Kong Metropolitan University',
      office: p.contact?.office || '',
      googleScholar: p.contact?.googleScholar || 'https://scholar.google.com/citations?user=2Zh-JoYAAAAJ',
      orcid: p.contact?.orcid || 'https://orcid.org/0000-0003-3159-3526',
      researchGate: p.contact?.researchGate || '',
      linkedin: p.contact?.linkedin || 'https://hk.linkedin.com/in/dongyunhao',
      scopus: p.contact?.scopus || 'https://www.scopus.com/authid/detail.uri?authorId=57208682948',
      universityProfile: p.contact?.universityProfile || 'https://scholars.hkmu.edu.hk/en/persons/yunhao-dong/'
    },
    researchInterests: Array.isArray(p.researchInterests) ? p.researchInterests : [],
    publications: Array.isArray(p.publications) ? p.publications : [],
    projects: Array.isArray(p.projects) ? p.projects : [],
    education: Array.isArray(p.education) ? p.education : [],
    awards: Array.isArray(p.awards) ? p.awards : [],
    academicExperience: Array.isArray(p.academicExperience) ? p.academicExperience : [],
    news: Array.isArray(p.news) ? p.news : [],
    memberships: Array.isArray(p.memberships) ? p.memberships : [],
    customSections: Array.isArray(p.customSections) ? p.customSections : []
  };
}

function ensureStableIds(data) {
  if (!data || typeof data !== 'object') return data;

  const arraySections = [
    'researchInterests',
    'publications',
    'projects',
    'education',
    'awards',
    'academicExperience',
    'news',
    'memberships',
    'customSections'
  ];

  arraySections.forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].map((item, index) => {
        if (typeof item === 'string') {
          return { id: `${key}_${index + 1}`, title: item };
        }
        if (!item.id) {
          return { ...item, id: `${key}_${index + 1}` };
        }
        return item;
      });
    } else {
      data[key] = [];
    }
  });

  return data;
}

// The database row is the source of truth; defaults only fill keys that are missing.
function normalizeSavedData(raw) {
  const base = getDefaultData();
  const { profile = {}, ...rest } = raw || {};
  return ensureStableIds({
    ...base,
    ...rest,
    ...profile,
    contact: { ...base.contact, ...(rest.contact || {}), ...(profile.contact || {}) }
  });
}

// ==============================================================================
// 3. Supabase Load & Save
// ==============================================================================

async function loadFromSupabase() {
  showLoading(true, 'Connecting to Supabase and loading content...');
  let row = null;

  if (!window.SUPABASE_CONFIG_READY) {
    loadFailed = true;
    showMessage('Supabase is not configured. Check supabase.js.', 'error', 0);
  } else {
    try {
      const { data, error } = await window.supabase
        .from('site_content')
        .select('page_data')
        .eq('id', 'main')
        .maybeSingle();
      if (error) throw error;
      row = data && data.page_data;
      showMessage(row ? 'Content loaded from Supabase.' : 'No saved content yet. Click "Save All Changes" to publish the starter content.', 'info', 4000);
    } catch (err) {
      loadFailed = true;
      console.error('Failed to load from Supabase:', err);
      showMessage(`Could not load content: ${err.message}. Saving is disabled until you reload.`, 'error', 0);
    }
  }

  showLoading(false);
  return normalizeSavedData(row);
}

async function persistToSupabase(delta = {}) {
  if (!window.SUPABASE_CONFIG_READY) {
    throw new Error('Supabase is not configured yet. Please check supabase.js.');
  }
  if (loadFailed) {
    throw new Error('Content could not be loaded from the database. Reload the page before saving.');
  }

  // 1. Merge delta directly into currentData
  const base = currentData || getDefaultData();
  const merged = {
    ...base,
    ...delta
  };

  if (delta.contact) {
    merged.contact = {
      ...(base.contact || {}),
      ...delta.contact
    };
  }

  const finalPayload = ensureStableIds(merged);

  // 2. Upsert to Supabase site_content
  const { data: saved, error: upsertError } = await window.supabase
    .from('site_content')
    .upsert(
      { id: 'main', page_data: finalPayload, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select('id');

  if (upsertError) {
    console.error('Supabase upsert failed:', upsertError);
    throw upsertError;
  }
  if (!saved || saved.length === 0) {
    throw new Error('The database rejected the save (permissions). Make sure you are logged in.');
  }

  // 3. Update memory and dashboard (the public site picks changes up from the database)
  currentData = finalPayload;
  updateDashboard(finalPayload);
  return finalPayload;
}

// ==============================================================================
// 4. Form Harvesting & Profile Form
// ==============================================================================

function applyProfileForm(data) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('name', data.name);
  setVal('title', data.title);
  setVal('department', data.department);
  setVal('university', data.university);
  setVal('shortDescription', data.shortDescription);
  setVal('about', Array.isArray(data.about) ? data.about.join('\n\n') : (data.about || ''));
  setVal('publicationsFullListUrl', data.publicationsFullListUrl);

  const photoUrl = data.profileImage || 'images/profile.jpg';
  setVal('profileImage', photoUrl);
  if (profileImagePreview) {
    profileImagePreview.src = photoUrl;
    profileImagePreview.onerror = () => {
      profileImagePreview.onerror = null;
      profileImagePreview.src = 'images/placeholder.svg';
    };
  }

  const c = data.contact || {};
  setVal('email', c.email);
  setVal('office', c.office);
  setVal('googleScholar', c.googleScholar);
  setVal('orcid', c.orcid);
  setVal('linkedin', c.linkedin);
  setVal('scopus', c.scopus);
  setVal('researchGate', c.researchGate);
  setVal('universityProfile', c.universityProfile);
}

function getProfileFormData() {
  const getVal = (id) => (document.getElementById(id)?.value || '').trim();

  const bioRaw = getVal('about');
  const aboutParagraphs = bioRaw
    ? bioRaw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)
    : [];

  const university = getVal('university');

  return {
    name: getVal('name'),
    title: getVal('title'),
    department: getVal('department'),
    university: university,
    shortDescription: getVal('shortDescription'),
    about: aboutParagraphs,
    profileImage: getVal('profileImage') || 'images/profile.jpg',
    publicationsFullListUrl: getVal('publicationsFullListUrl'),
    contact: {
      email: getVal('email'),
      office: getVal('office'),
      university: university,
      googleScholar: getVal('googleScholar'),
      orcid: getVal('orcid'),
      linkedin: getVal('linkedin'),
      scopus: getVal('scopus'),
      researchGate: getVal('researchGate'),
      universityProfile: getVal('universityProfile')
    }
  };
}

/**
 * Harvests current input values from any open cards in a section container.
 * This guarantees that even if the user typed inside a card and clicked "Save [Section]",
 * their live edits are saved.
 */
function harvestSectionData(kind) {
  const schema = SECTION_SCHEMAS[kind];
  if (!schema) return currentData ? currentData[kind] : [];

  const container = document.getElementById(schema.containerId);
  if (!container) return currentData ? currentData[kind] : [];

  const list = [...(currentData[kind] || [])];

  container.querySelectorAll('.item-card').forEach((card) => {
    const itemId = card.dataset.itemId;
    const editor = card.querySelector('.item-editor-form');

    if (editor && itemId) {
      const idx = list.findIndex(i => i.id === itemId);
      if (idx !== -1) {
        const updatedItem = { ...list[idx] };
        schema.fields.forEach((field) => {
          const input = editor.querySelector(`[data-key="${field.key}"]`);
          if (input) {
            const val = input.value.trim();
            updatedItem[field.key] = val;
            if (field.key === 'details') {
              updatedItem.description = val;
            }
          }
        });
        list[idx] = updatedItem;
      }
    }
  });

  return (kind === 'publications' || kind === 'projects' || kind === 'news')
    ? sortByYearDesc(list)
    : list;
}

// ==============================================================================
// 5. Profile Image Upload & Reset
// ==============================================================================

async function uploadProfileImage() {
  const file = profileImageInput?.files?.[0];

  if (!file) {
    showMessage('Please select an image file first.', 'error');
    return;
  }

  if (!window.SUPABASE_CONFIG_READY) {
    showMessage('Supabase is not configured yet. Check supabase.js.', 'error');
    return;
  }

  try {
    showMessage('Uploading profile image to Supabase Storage...', 'info', 0);
    const bucket = 'profile-images';
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `profile-${Date.now()}-${sanitized}`;

    const { error: uploadError } = await window.supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = window.supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = publicUrlData.publicUrl;

    if (profileImageField) profileImageField.value = publicUrl;
    if (profileImagePreview) profileImagePreview.src = publicUrl;

    await persistToSupabase({ profileImage: publicUrl });
    showMessage('Profile image uploaded and published to the website!', 'success');
  } catch (error) {
    console.error('Image upload failed:', error);
    showMessage(`Image upload failed: ${error.message}`, 'error', 0);
  }
}

async function removeProfileImage() {
  const defaultPath = 'images/profile.jpg';
  if (profileImageField) profileImageField.value = defaultPath;
  if (profileImagePreview) profileImagePreview.src = defaultPath;
  if (profileImageInput) profileImageInput.value = '';

  try {
    await persistToSupabase({ profileImage: defaultPath });
    showMessage('Profile image reset to default.', 'success');
  } catch (error) {
    showMessage(`Failed to reset profile image: ${error.message}`, 'error', 0);
  }
}

// ==============================================================================
// 6. Section Schema & Card Rendering
// ==============================================================================

const SECTION_SCHEMAS = {
  researchInterests: {
    label: 'Research Interest',
    containerId: 'research-list',
    addBoxId: 'add-box-researchInterests',
    fields: [
      { key: 'title', label: 'Interest Title', type: 'text', required: true, fullWidth: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Untitled Research Topic',
      meta: item.description ? (item.description.length > 120 ? item.description.slice(0, 120) + '...' : item.description) : 'No description provided'
    })
  },
  publications: {
    label: 'Publication',
    containerId: 'publication-list',
    addBoxId: 'add-box-publications',
    fields: [
      { key: 'title', label: 'Paper Title', type: 'text', required: true, fullWidth: true },
      { key: 'authors', label: 'Authors', type: 'text', fullWidth: true },
      { key: 'venue', label: 'Journal / Conference (Venue)', type: 'text', fullWidth: true },
      { key: 'year', label: 'Year', type: 'text' },
      {
        key: 'type',
        label: 'Publication Type',
        type: 'select',
        options: ['Journal', 'Conference', 'Review', 'Book Chapter', 'Preprint', 'Other']
      },
      { key: 'link', label: 'Paper URL / DOI Link', type: 'url', fullWidth: true },
      { key: 'description', label: 'Abstract / Notes (Optional)', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Untitled Publication',
      meta: [item.year, item.type, item.authors, item.venue].filter(Boolean).join(' · ')
    })
  },
  projects: {
    label: 'Project',
    containerId: 'project-list',
    addBoxId: 'add-box-projects',
    fields: [
      { key: 'title', label: 'Project Title', type: 'text', required: true, fullWidth: true },
      { key: 'role', label: 'Role (e.g. Principal Investigator)', type: 'text' },
      { key: 'year', label: 'Year or Range (e.g. 2024–2026)', type: 'text' },
      { key: 'link', label: 'Project Link (Optional)', type: 'url', fullWidth: true },
      { key: 'description', label: 'Project Description / Grant Details', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Untitled Project',
      meta: [item.year, item.role, item.description].filter(Boolean).join(' · ')
    })
  },
  education: {
    label: 'Education Entry',
    containerId: 'education-list',
    addBoxId: 'add-box-education',
    fields: [
      { key: 'degree', label: 'Degree & Honours', type: 'text', required: true, fullWidth: true },
      { key: 'institution', label: 'Institution & Country', type: 'text', required: true },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'description', label: 'Notes (Optional)', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.degree || 'Degree',
      meta: [item.year, item.institution].filter(Boolean).join(' · ')
    })
  },
  awards: {
    label: 'Award',
    containerId: 'awards-list',
    addBoxId: 'add-box-awards',
    fields: [
      { key: 'title', label: 'Award Title', type: 'text', required: true, fullWidth: true },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'organization', label: 'Organization (Optional)', type: 'text' },
      { key: 'details', label: 'Details / Description', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Award',
      meta: [item.year, item.organization, item.details || item.description].filter(Boolean).join(' · ')
    })
  },
  academicExperience: {
    label: 'Experience Entry',
    containerId: 'experience-list',
    addBoxId: 'add-box-academicExperience',
    fields: [
      { key: 'title', label: 'Position / Fellowship Title', type: 'text', required: true, fullWidth: true },
      { key: 'institution', label: 'Institution / University', type: 'text', required: true },
      { key: 'startYear', label: 'Start Year', type: 'text' },
      { key: 'endYear', label: 'End Year (or Present)', type: 'text' },
      { key: 'description', label: 'Description / Fellowship Details', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => {
      const dates = [item.startYear, item.endYear].filter(Boolean).join('–');
      return {
        title: item.title || 'Position',
        meta: [dates, item.institution, item.description].filter(Boolean).join(' · ')
      };
    }
  },
  news: {
    label: 'News Item',
    containerId: 'news-list',
    addBoxId: 'add-box-news',
    fields: [
      { key: 'title', label: 'Headline / Title', type: 'text', required: true, fullWidth: true },
      { key: 'date', label: 'Date (e.g. October 2026)', type: 'text' },
      { key: 'link', label: 'Link (Optional)', type: 'url' },
      { key: 'description', label: 'Details / Description', type: 'textarea', fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Headline',
      meta: [item.date, item.description].filter(Boolean).join(' · ')
    })
  },
  memberships: {
    label: 'Membership',
    containerId: 'memberships-list',
    addBoxId: 'add-box-memberships',
    fields: [
      { key: 'title', label: 'Membership / Committee / Association', type: 'text', required: true, fullWidth: true }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Membership',
      meta: ''
    })
  },
  customSections: {
    label: 'Custom Section',
    containerId: 'custom-sections-list',
    addBoxId: 'add-box-customSections',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', required: true, fullWidth: true },
      { key: 'content', label: 'Section Content', type: 'textarea', required: true, fullWidth: true },
      { key: 'link', label: 'Link URL (Optional)', type: 'url' },
      { key: 'linkText', label: 'Link Label (e.g. Read more →)', type: 'text' }
    ],
    formatSummary: (item) => ({
      title: item.title || 'Custom Section',
      meta: item.content ? (item.content.length > 100 ? item.content.slice(0, 100) + '...' : item.content) : ''
    })
  }
};

function renderItemCard(kind, item, schema) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.id = `card-${item.id}`;
  card.dataset.itemId = item.id;

  const summary = schema.formatSummary(item);

  // Compact header
  const header = document.createElement('div');
  header.className = 'item-header';

  const info = document.createElement('div');
  info.className = 'item-info';

  const titleEl = document.createElement('div');
  titleEl.className = 'item-title';
  titleEl.textContent = summary.title;

  const metaEl = document.createElement('div');
  metaEl.className = 'item-meta';
  metaEl.textContent = summary.meta;

  info.append(titleEl, metaEl);

  const actions = document.createElement('div');
  actions.className = 'item-actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'ghost-button small-button';
  editBtn.textContent = 'Edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'ghost-button danger-ghost small-button';
  deleteBtn.textContent = 'Delete';

  actions.append(editBtn, deleteBtn);
  header.append(info, actions);
  card.appendChild(header);

  // Editor container
  const editorContainer = document.createElement('div');
  editorContainer.className = 'item-editor-form';
  editorContainer.style.display = 'none';

  const grid = document.createElement('div');
  grid.className = 'editor-grid';

  const inputMap = {};

  schema.fields.forEach((field) => {
    const label = document.createElement('label');
    if (field.fullWidth) label.className = 'full-width';
    label.textContent = field.label;

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
    } else if (field.type === 'select') {
      input = document.createElement('select');
      (field.options || []).forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }

    input.dataset.key = field.key;
    const val = field.key === 'details'
      ? (item.details || item.description || '')
      : (item[field.key] || '');
    input.value = val;
    inputMap[field.key] = input;

    label.appendChild(input);
    grid.appendChild(label);
  });

  const editorActions = document.createElement('div');
  editorActions.className = 'editor-actions';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'primary-button small-button';
  saveBtn.textContent = 'Save Changes';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'secondary-button small-button';
  cancelBtn.textContent = 'Cancel';

  editorActions.append(cancelBtn, saveBtn);
  editorContainer.append(grid, editorActions);
  card.appendChild(editorContainer);

  // Toggle edit
  editBtn.addEventListener('click', () => {
    const isEditing = editorContainer.style.display === 'flex';
    if (isEditing) {
      editorContainer.style.display = 'none';
      card.classList.remove('editing');
      editBtn.textContent = 'Edit';
    } else {
      editorContainer.style.display = 'flex';
      card.classList.add('editing');
      editBtn.textContent = 'Close';
    }
  });

  cancelBtn.addEventListener('click', () => {
    editorContainer.style.display = 'none';
    card.classList.remove('editing');
    editBtn.textContent = 'Edit';
  });

  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const updatedItem = { ...item };
    schema.fields.forEach((field) => {
      const val = (inputMap[field.key].value || '').trim();
      updatedItem[field.key] = val;
      if (field.key === 'details') {
        updatedItem.description = val;
      }
    });

    try {
      const list = [...(currentData[kind] || [])];
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = updatedItem;
      } else {
        list.push(updatedItem);
      }

      const finalSorted = (kind === 'publications' || kind === 'projects' || kind === 'news')
        ? sortByYearDesc(list)
        : list;

      await persistToSupabase({ [kind]: finalSorted });
      showMessage(`${schema.label} saved and published!`, 'success');
      renderSectionList(kind);
    } catch (err) {
      console.error(err);
      showMessage(`Failed to save: ${err.message}`, 'error', 0);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
    }
  });

  deleteBtn.addEventListener('click', async () => {
    const confirmName = summary.title || schema.label;
    const ok = window.confirm(`Are you sure you want to delete "${confirmName}"?\nThis cannot be undone.`);
    if (!ok) return;

    try {
      const nextList = (currentData[kind] || []).filter(i => i.id !== item.id);
      await persistToSupabase({ [kind]: nextList });
      showMessage(`${schema.label} deleted.`, 'success');
      renderSectionList(kind);
    } catch (err) {
      console.error(err);
      showMessage(`Delete failed: ${err.message}`, 'error', 0);
    }
  });

  return card;
}

function renderSectionList(kind) {
  const schema = SECTION_SCHEMAS[kind];
  if (!schema) return;

  const container = document.getElementById(schema.containerId);
  if (!container) return;

  container.innerHTML = '';

  const rawItems = currentData ? (currentData[kind] || []) : [];
  const items = (kind === 'publications' || kind === 'projects' || kind === 'news')
    ? sortByYearDesc(rawItems)
    : rawItems;

  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = `No ${schema.label.toLowerCase()} entries found. Click "+ Add ${schema.label}" below to add one.`;
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = renderItemCard(kind, item, schema);
    container.appendChild(card);
  });
}

function setupAddBoxes() {
  Object.keys(SECTION_SCHEMAS).forEach((kind) => {
    const schema = SECTION_SCHEMAS[kind];
    const addBox = document.getElementById(schema.addBoxId);
    const addBtn = document.querySelector(`.add-button[data-kind="${kind}"]`);

    if (!addBox || !addBtn) return;

    addBox.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = `Add New ${schema.label}`;
    addBox.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'editor-grid';

    const inputMap = {};

    schema.fields.forEach((field) => {
      const label = document.createElement('label');
      if (field.fullWidth) label.className = 'full-width';
      label.textContent = field.label;

      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else if (field.type === 'select') {
        input = document.createElement('select');
        (field.options || []).forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }

      inputMap[field.key] = input;
      label.appendChild(input);
      grid.appendChild(label);
    });

    const actions = document.createElement('div');
    actions.className = 'editor-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'secondary-button small-button';
    cancelBtn.textContent = 'Cancel';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'primary-button small-button';
    saveBtn.textContent = `Save ${schema.label}`;

    actions.append(cancelBtn, saveBtn);
    addBox.append(grid, actions);

    addBtn.addEventListener('click', () => {
      const isVisible = addBox.style.display === 'block';
      addBox.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        addBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    cancelBtn.addEventListener('click', () => {
      addBox.style.display = 'none';
    });

    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const newItem = { id: generateId(kind) };
      schema.fields.forEach((field) => {
        const val = (inputMap[field.key].value || '').trim();
        newItem[field.key] = val;
        if (field.key === 'details') {
          newItem.description = val;
        }
      });

      const reqField = schema.fields.find(f => f.required);
      if (reqField && !newItem[reqField.key]) {
        showMessage(`Please fill in "${reqField.label}".`, 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = `Save ${schema.label}`;
        return;
      }

      try {
        const list = [...(currentData[kind] || [])];
        list.unshift(newItem);

        const finalSorted = (kind === 'publications' || kind === 'projects' || kind === 'news')
          ? sortByYearDesc(list)
          : list;

        await persistToSupabase({ [kind]: finalSorted });

        schema.fields.forEach(field => {
          inputMap[field.key].value = '';
        });

        addBox.style.display = 'none';
        showMessage(`New ${schema.label.toLowerCase()} added and published!`, 'success');
        renderSectionList(kind);
      } catch (err) {
        console.error(err);
        showMessage(`Failed to add: ${err.message}`, 'error', 0);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = `Save ${schema.label}`;
      }
    });
  });
}

function updateDashboard(data) {
  const set = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(count);
  };

  set('stat-profile', (data.name && data.name !== 'Professor Name') ? 1 : 0);
  set('stat-research', Array.isArray(data.researchInterests) ? data.researchInterests.length : 0);
  set('stat-publications', Array.isArray(data.publications) ? data.publications.length : 0);
  set('stat-projects', Array.isArray(data.projects) ? data.projects.length : 0);
  set('stat-education', Array.isArray(data.education) ? data.education.length : 0);
  set('stat-awards', Array.isArray(data.awards) ? data.awards.length : 0);
  set('stat-experience', Array.isArray(data.academicExperience) ? data.academicExperience.length : 0);
  set('stat-news', Array.isArray(data.news) ? data.news.length : 0);
  set('stat-memberships', Array.isArray(data.memberships) ? data.memberships.length : 0);
}

function renderAllLists(data) {
  Object.keys(SECTION_SCHEMAS).forEach((kind) => {
    renderSectionList(kind);
  });
  updateDashboard(data);
}

// ==============================================================================
// 7. Save All Content Function
// ==============================================================================

async function saveAllContent() {
  const profileDelta = getProfileFormData();

  const completePayload = {
    ...profileDelta,
    researchInterests: harvestSectionData('researchInterests'),
    publications: harvestSectionData('publications'),
    projects: harvestSectionData('projects'),
    education: harvestSectionData('education'),
    awards: harvestSectionData('awards'),
    academicExperience: harvestSectionData('academicExperience'),
    news: harvestSectionData('news'),
    memberships: harvestSectionData('memberships'),
    customSections: harvestSectionData('customSections')
  };

  await persistToSupabase(completePayload);
  renderAllLists(currentData);
}

// ==============================================================================
// 8. Initialization & Event Listeners
// ==============================================================================

async function initializeEditor() {
  // 1. Session check with auto-refresh
  if (window.SUPABASE_CONFIG_READY) {
    try {
      const { data: authData } = await window.supabase.auth.getSession();
      if (!authData || !authData.session) {
        window.location.href = 'login.html';
        return;
      }
      // Check expiry and refresh if near expiry
      const expiresAt = authData.session.expires_at;
      const nowSec = Math.floor(Date.now() / 1000);
      if (expiresAt && expiresAt < nowSec + 300) {
        try {
          await window.supabase.auth.refreshSession();
        } catch (e) {
          console.warn('Session refresh:', e);
        }
      }
    } catch (e) {
      console.warn('Session check:', e);
      window.location.href = 'login.html';
      return;
    }
  }

  // 2. Fetch data from Supabase
  currentData = await loadFromSupabase();

  // 3. Populate form and render lists
  applyProfileForm(currentData);
  setupAddBoxes();
  renderAllLists(currentData);

  // 4. Save section topbar buttons
  document.querySelectorAll('.save-section-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const section = button.dataset.section;
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Saving...';

      try {
        let delta = {};
        if (section === 'profile') {
          delta = getProfileFormData();
        } else {
          delta = { [section]: harvestSectionData(section) };
        }

        await persistToSupabase(delta);
        showMessage(`${originalText.replace('Save', '').trim() || 'Section'} saved and published!`, 'success');
        if (section !== 'profile') {
          renderSectionList(section);
        }
      } catch (err) {
        console.error(err);
        showMessage(`Save failed: ${err.message}`, 'error', 0);
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });

  // 5. Save All Changes Button
  if (saveAllButton) {
    saveAllButton.addEventListener('click', async () => {
      saveAllButton.disabled = true;
      const originalText = saveAllButton.textContent;
      saveAllButton.textContent = 'Saving Everything...';

      try {
        await saveAllContent();
        showMessage('All changes saved and published to the website!', 'success');
      } catch (err) {
        console.error(err);
        showMessage(`Save failed: ${err.message}`, 'error', 0);
      } finally {
        saveAllButton.disabled = false;
        saveAllButton.textContent = originalText;
      }
    });
  }

  // 6. Image Upload & Reset buttons
  if (uploadImageButton) {
    uploadImageButton.addEventListener('click', uploadProfileImage);
  }
  if (removeImageButton) {
    removeImageButton.addEventListener('click', removeProfileImage);
  }

  // Image input preview on local file selection
  if (profileImageInput) {
    profileImageInput.addEventListener('change', () => {
      const file = profileImageInput.files?.[0];
      if (file && profileImagePreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 7. Logout
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        if (window.supabase) {
          await window.supabase.auth.signOut();
        }
      } catch (e) {
        console.warn('Logout error:', e);
      }
      window.location.href = 'login.html';
    });
  }

  // Auth state change listener
  if (window.supabase && window.supabase.auth) {
    window.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = 'login.html';
      }
    });
  }
}

// Start
document.addEventListener('DOMContentLoaded', initializeEditor);