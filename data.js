/* ==========================================================================
   data.js  -  ALL EDITABLE CONTENT FOR THE WEBSITE LIVES IN THIS FILE
   --------------------------------------------------------------------------
   HOW TO EDIT (beginner tips):
   - Text goes inside "double quotes".
   - Every item inside [ ... ] is separated by a comma.
   - Every item inside { ... } is also separated by a comma.
   - To ADD something: copy an existing { ... } block, paste it right after
     (put a comma between the blocks), then change the text.
   - To HIDE a field: leave it empty like this  link: ""
   - If a whole list is empty ( [] ) the website hides that section.

   All information below was taken from the professor's public pages
   (HKMU Scholars profile, ORCID, publisher pages). Check it before publishing.
   ========================================================================== */

const professorData = {

    /* ---------------------------------------------------------------------
       1. BASIC INFORMATION (shown on the Home section)
       --------------------------------------------------------------------- */
    name: "Dr. Yun-Hao Dong",
    title: "Senior Lecturer",
    department: "Department of Construction and Quality Management",
    university: "Hong Kong Metropolitan University",

    // Short sentence under the name on the Home page
    shortDescription:
        "Research on data-informed planning and management of urban underground space, " +
        "integrating geotechnical engineering, urban planning, urban informatics and artificial intelligence.",

    // The photo is read from images/profile.jpg  (just replace that file)
    profileImage: "images/profile.jpg",


    /* ---------------------------------------------------------------------
       2. ABOUT / BIOGRAPHY
       Each line inside [ ] is one paragraph.
       --------------------------------------------------------------------- */
    about: [
        "Dr. Yun-Hao Dong is a Senior Lecturer in the Department of Construction and Quality Management, Hong Kong Metropolitan University (HKMU). He received his PhD (awarded outstanding thesis) and BEng degrees in Civil Engineering from Tongji University, both with highest distinction. Before joining HKMU, Dr. Dong was a Hong Kong Scholar Postdoctoral Fellow at City University of Hong Kong. He previously completed postdoctoral research in the College of Civil Engineering at Tongji University.",

        "His research focuses on data-informed planning and management of urban underground space, with particular interests in metro-led underground development, urban morphology, spatial analytics, digital twins and resilient infrastructure. His work integrates geotechnical engineering, urban planning, urban informatics and artificial intelligence to support evidence-based planning and infrastructure decision-making.",

        "Dr. Dong has published 35 peer-reviewed journal papers and 12 conference papers. His research has appeared in leading journals including Tunnelling and Underground Space Technology, Underground Space, Applied Geography, Sustainable Cities and Society, Energy and Buildings and Automation in Construction. Two of his publications have been recognised as ESI Highly Cited Papers.",

        "Moreover, he has served as Principal Investigator for projects supported by the National Natural Science Foundation of China (NSFC), the Hong Kong Scholars Program, and the Yangpu District Government of Shanghai. His research has also contributed to national and regional planning guidelines, including consultancy work for China's Ministry of Natural Resources and the development of planning guidelines for metro-led underground space in Jinan."
    ],

    // Professional memberships (shown in the About section)
    memberships: [
        "Member, Associated Research Centers for the Urban Underground Space (ACUUS), 2019–present",
        "Member, International Society for Urban Informatics, 2022–present",
        "Member, Working Group 15 – Sustainability and Resilience, International Tunnelling and Underground Space Association, 2024–present",
        "Member, Sino-Singapore Underground Space and Urban Sustainable Innovation Industry Alliance, 2024–present",
        "Member, Underground Space Committee, Chinese Society for Rock Mechanics and Engineering, 2024–present",
        "Committee Member, Underground Space Committee, Chinese Civil Engineering Society, 2024–present",
        "Committee Member, Underground Space Committee, Chinese Society for Urban Studies, 2023–present",
        "Committee Member, Jiangsu Underground Space Society, 2024–present",
        "Member, Hong Kong Association of Overseas-Returned Scholars Limited, 2026–present",
        "Member, Hong Kong Scholars Think Tank, 2026–present"
    ],


    /* ---------------------------------------------------------------------
       3. RESEARCH INTERESTS
       Each one has a title and (optionally) a short description.
       --------------------------------------------------------------------- */
    researchInterests: [
        {
            title: "Urban underground space planning and utilisation",
            description: "Planning and development of urban underground space, with particular attention to metro-led underground development, urban morphology and spatial analytics."
        },
        {
            title: "Data-informed decision support for urban planning",
            description: "Using multisource data and artificial intelligence to support evidence-based planning and infrastructure decision-making."
        },
        {
            title: "Digital twins for smart construction, operation, and maintenance",
            description: "Digital-twin approaches to smart construction and maintenance, supported by the Hong Kong Scholars Program."
        },
        {
            title: "Sustainable and resilient urban infrastructures",
            description: "Resilient infrastructure and urban resilience, including the resilience evolution of metro networks."
        },
        {
            title: "Urban ageing and inclusive cities",
            description: ""
        }
    ],


    /* ---------------------------------------------------------------------
       4. PUBLICATIONS
       To add a new paper: copy one { ... } block, paste it at the TOP of the
       list, put a comma after it, and change the text. The website sorts by
       year automatically.
       - link: paper URL or DOI link (leave "" if none)
       --------------------------------------------------------------------- */

    // Link to the complete official publication list (shown under the list)
    publicationsFullListUrl: "https://scholars.hkmu.edu.hk/en/persons/yunhao-dong/publications/",

    publications: [
        {
            title: "Deciphering the resilience evolution of global metro networks",
            authors: "Yun-Hao Dong, Fang-Le Peng, Xiao-Wei Luo, Wout Broere",
            venue: "Tunnelling and Underground Space Technology, 176, 107831",
            year: "2026",
            link: "https://doi.org/10.1016/j.tust.2026.107831"
        },
        {
            title: "An enhanced layout planning approach for metro-led underground space integrating spatial morphology and function",
            authors: "Yun-Hao Dong, Fang-Le Peng, Yong-Kang Qiao, Wei-Xi Wang, Xiao-Wei Luo",
            venue: "Underground Space, 28, 206–224",
            year: "2026",
            link: "https://doi.org/10.1016/j.undsp.2025.07.008"
        },
        {
            title: "Review on data-informed planning for underground space",
            authors: "Fang-Le Peng, Wei-Xi Wang, Yong-Kang Qiao, Chen-Xiao Ma, Yun-Hao Dong",
            venue: "Underground Space, 26, 257–281",
            year: "2026",
            link: "https://doi.org/10.1016/j.undsp.2025.06.001"
        },
        {
            title: "Unveiling spatial heterogeneity in urban underground space development patterns and mechanisms for differentiated planning: A points of interest-based study of Shanghai",
            authors: "C. Ma, F. Peng, Y. Qiao, Y. Dong",
            venue: "Deep Underground Science and Engineering (accepted / in press)",
            year: "2026",
            link: "https://doi.org/10.1002/dug2.70085"
        },
        {
            title: "A bottom-up approach of knowledge graph modelling for urban underground public spaces: Insights into public cognition",
            authors: "Qi Pan, Shiu-Tong Thomas Ng, Fang-Le Peng, Yun-Hao Dong",
            venue: "Tunnelling and Underground Space Technology, 163, 106710",
            year: "2025",
            link: "https://doi.org/10.1016/j.tust.2025.106710"
        },
        {
            title: "Modeling of public perception in metro-led underground public space for planning optimization: A case study of Hong Kong",
            authors: "Qi Pan, Yun-Hao Dong, Fang-Le Peng, Shiu-Tong Thomas Ng",
            venue: "19th World Conference of the Associated Research Centres for the Urban Underground Space (ACUUS), Belgrade, Paper 5.4.51",
            year: "2025",
            link: "https://doi.org/10.46793/ACUUS2025.5.4.51"
        },
        {
            title: "Identifying implementation-oriented models of urban underground space development in China based on fuzzy-set qualitative comparative analysis (fsQCA)",
            authors: "Wei-Xi Wang, Fang-Le Peng, Chen-Xiao Ma, Yun-Hao Dong",
            venue: "Tunnelling and Underground Space Technology, 153, 106007",
            year: "2024",
            link: "https://doi.org/10.1016/j.tust.2024.106007"
        },
        {
            title: "Quantitative evaluation of the contribution of underground space to urban resilience: A case study in China",
            authors: "Si-Cong Liu, Fang-Le Peng, Yong-Kang Qiao, Yun-Hao Dong",
            venue: "Underground Space, 17(4), 1–24",
            year: "2024",
            link: "https://doi.org/10.1016/j.undsp.2023.11.007"
        },
        {
            title: "Planning an adaptive reuse development of underutilized urban underground infrastructures: A case study of Qingdao, China",
            authors: "Yong-Kang Qiao, Fang-Le Peng, Yun-Hao Dong, Chun-Fang Lu",
            venue: "Underground Space, 14, 18–33",
            year: "2024",
            link: "https://doi.org/10.1016/j.undsp.2023.05.005"
        },
        {
            title: "Spatiotemporal characteristics of Chinese metro-led underground space development: A multiscale analysis driven by big data",
            authors: "Yun-Hao Dong, Fang-Le Peng, Hu Li, Yan-Qing Men",
            venue: "Tunnelling and Underground Space Technology, 139, 105209",
            year: "2023",
            link: "https://doi.org/10.1016/j.tust.2023.105209"
        },
        {
            title: "Spatial autocorrelation and spatial heterogeneity of underground parking space development in Chinese megacities based on multisource open data",
            authors: "Yun-Hao Dong, Fang-Le Peng, Hu Li, Yan-Qing Men",
            venue: "Applied Geography, 153, 102897",
            year: "2023",
            link: "https://doi.org/10.1016/j.apgeog.2023.102897"
        },
        {
            title: "Automatic identification and feature recognition of the metro-led underground space in China based on point of interest data",
            authors: "Yun-Hao Dong, Fang-Le Peng, Yang Du, Yan-Qing Men",
            venue: "Underground Space, 9, 186–199",
            year: "2023",
            link: "https://doaj.org/article/67136ecb35ef447b872e44e79e59be5f"
        },
        {
            title: "The next frontier: Data-driven urban underground space planning orienting multiple development concepts",
            authors: "Fang-Le Peng, Yun-Hao Dong, Wei-Xi Wang, Chen-Xiao Ma",
            venue: "Smart Construction and Sustainable Cities, 1(1), 3",
            year: "2023",
            link: "https://doi.org/10.1007/s44268-023-00003-5"
        },
        {
            title: "An intelligent layout planning model for underground space surrounding metro stations based on NSGA-II",
            authors: "Yun-Hao Dong, Fang-Le Peng, Bing-Hao Zha, Yong-Kang Qiao, Hu Li",
            venue: "Tunnelling and Underground Space Technology, 128, 104648",
            year: "2022",
            link: "https://doi.org/10.1016/j.tust.2022.104648"
        },
        {
            title: "Quantitative assessment method on urban vitality of metro-led underground space based on multi-source data: A case study of Shanghai Inner Ring area",
            authors: "Yun-Hao Dong, Fang-Le Peng, Teng-Fei Guo",
            venue: "Tunnelling and Underground Space Technology, 116, 104108",
            year: "2021",
            link: "https://doi.org/10.1016/j.tust.2021.104108"
        },
        {
            title: "Identification of the spatial distribution pattern and driving forces of underground parking space based on multi-source data: A case study of Fuzhou City in China",
            authors: "Yun-Hao Dong, Fang-Le Peng, Zong-Hui Bao, Yong-Kang Qiao",
            venue: "Sustainable Cities and Society, 72, 103084",
            year: "2021",
            link: "https://doi.org/10.1016/j.scs.2021.103084"
        },
        {
            title: "Measuring the monetary value of environmental externalities derived from urban underground facilities: Towards a better understanding of sustainable underground spaces",
            authors: "Yun-Hao Dong, Fang-Le Peng, Yong-Kang Qiao, J. B. Zhang, X. L. Wu",
            venue: "Energy and Buildings, 250, 111313",
            year: "2021",
            link: "https://doi.org/10.1016/j.enbuild.2021.111313"
        },
        {
            title: "Spatial accessibility and functional layout impacts on urban underground space development: A case study of Shanghai",
            authors: "Yun-Hao Dong, Fang-Le Peng, Xiao Xing, Xiao-Lei Wu",
            venue: "IOP Conference Series: Earth and Environmental Science, 703, 012014",
            year: "2021",
            link: "https://www.researchgate.net/publication/353322179_IOP_Conference_Series_Earth_and_Environmental_Science_Spatial_accessibility_and_functional_layout_impacts_on_urban_underground_space_development_a_case_study_of_Shanghai_Spatial_accessibility_and_func"
        }
    ],


    /* ---------------------------------------------------------------------
       5. PROJECTS  (selected research grants)
       - year: can be a single year or a range like "2024–2026"
       - link: optional (leave "" if none)
       --------------------------------------------------------------------- */
    projects: [
        {
            title: "Multi-dimensional Evolution Mechanisms and Intelligent Layout Planning for Metro-led Underground Space Based on Multisource Data",
            description: "Principal Investigator. National Natural Science Foundation of China, Grant No. 42301289, RMB 300,000.",
            year: "2024–2026",
            link: ""
        },
        {
            title: "Smart Construction and Maintenance Based on Digital Twin",
            description: "Principal Investigator. Hong Kong Scholars Program, Grant No. XJ2023059, RMB 360,000.",
            year: "2024–2026",
            link: ""
        },
        {
            title: "Intelligent Planning and Performance Evaluation for Underground Space Based on Multisource Spatiotemporal Data",
            description: "Principal Investigator. Yangpu District Government, Shanghai, RMB 100,000.",
            year: "2023–2024",
            link: ""
        },
        {
            title: "Performance Evaluation and Planning Optimisation of Urban Underground Space in the Context of Existing-Land Redevelopment: A Case Study of Shanghai",
            description: "Co-Investigator. National Natural Science Foundation of China, Grant No. 42071251, RMB 500,000.",
            year: "2021–2024",
            link: ""
        },
        {
            title: "Research on the Development Model and Integration of Underground Space in Inter-city High-speed Railway Station Areas",
            description: "Co-Investigator. Supported by China Railway 10th Engineering Group Co., Ltd., RMB 700,000.",
            year: "2022–2024",
            link: ""
        },
        {
            title: "Comprehensive Utilisation Models and Planning Guidelines for Metro-led Underground Space in Jinan",
            description: "Co-Investigator. Supported by Jinan Rail Transit Group Co., Ltd., RMB 3,200,000.",
            year: "2020–2023",
            link: ""
        }
    ],


    /* ---------------------------------------------------------------------
       6. EDUCATION
       --------------------------------------------------------------------- */
    education: [
        {
            degree: "PhD in Civil Engineering (highest distinction; Outstanding Doctoral Thesis)",
            institution: "Tongji University, China",
            year: "2022"
        },
        {
            degree: "BEng in Civil Engineering (highest distinction)",
            institution: "Tongji University, China",
            year: "2017"
        }
    ],


    /* ---------------------------------------------------------------------
       7. AWARDS  (shown under Education)
       --------------------------------------------------------------------- */
    awards: [
        {
            title: "Best Paper Award",
            details: "19th Conference of the Associated Research Centers for the Urban Underground Space (ACUUS), Belgrade",
            year: "2025"
        },
        {
            title: "Best Presentation Award",
            details: "Hong Kong Scholars Annual Symposium",
            year: "2025"
        },
        {
            title: "Hong Kong Scholars Award",
            details: "One of 60 awardees selected from the Chinese mainland",
            year: "2024"
        },
        {
            title: "Special (1st) Prize, Science and Technology Award",
            details: "Jiangsu Underground Space Society",
            year: "2024"
        },
        {
            title: "Best Presentation Award",
            details: "18th Conference of the Associated Research Centers for the Urban Underground Space (ACUUS), Singapore",
            year: "2023"
        },
        {
            title: "Outstanding Doctoral Thesis",
            details: "Tongji University",
            year: "2023"
        },
        {
            title: "National Scholarship for PhD Candidates",
            details: "",
            year: "2021"
        }
    ],


    /* ---------------------------------------------------------------------
       8. NEWS / UPDATES
       Newest first. To add news: copy a { ... } block to the TOP of the list.
       --------------------------------------------------------------------- */
    news: [
        {
            date: "October 2026",
            title: "New paper: Deciphering the resilience evolution of global metro networks",
            description: "Published in Tunnelling and Underground Space Technology.",
            link: "https://doi.org/10.1016/j.tust.2026.107831"
        },
        {
            date: "June 2026",
            title: "New paper: An enhanced layout planning approach for metro-led underground space",
            description: "Published in Underground Space.",
            link: "https://doi.org/10.1016/j.undsp.2025.07.008"
        },
        {
            date: "February 2026",
            title: "New review paper: Review on data-informed planning for underground space",
            description: "Published in Underground Space.",
            link: "https://doi.org/10.1016/j.undsp.2025.06.001"
        },
        {
            date: "2025",
            title: "Best Paper Award at ACUUS 2025",
            description: "19th Conference of the Associated Research Centers for the Urban Underground Space, Belgrade.",
            link: ""
        },
        {
            date: "2025",
            title: "Best Presentation Award at the Hong Kong Scholars Annual Symposium",
            description: "",
            link: ""
        },
        {
            date: "2024",
            title: "Hong Kong Scholars Award",
            description: "One of 60 awardees selected from the Chinese mainland.",
            link: ""
        }
    ],


    /* ---------------------------------------------------------------------
       9. CONTACT
       Only fields that are NOT empty are shown on the website.
       (Office and ResearchGate were not found on public pages, so they are
       empty. Fill them in when the professor provides them.)
       --------------------------------------------------------------------- */
    contact: {
        email: "mdong@hkmu.edu.hk",
        university: "Hong Kong Metropolitan University",
        office: "",
        googleScholar: "https://scholar.google.com/citations?user=2Zh-JoYAAAAJ",
        orcid: "https://orcid.org/0000-0003-3159-3526",
        researchGate: "",
        linkedin: "https://hk.linkedin.com/in/dongyunhao",
        scopus: "https://www.scopus.com/authid/detail.uri?authorId=57208682948",
        universityProfile: "https://scholars.hkmu.edu.hk/en/persons/yunhao-dong/"
    }
};
