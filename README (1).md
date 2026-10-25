# Academic Profile Website

A simple static website (HTML + CSS + JavaScript only). No backend, no database, no build tools.
It works directly on GitHub Pages.

## Which file controls the content?

**`data.js`** controls ALL the content. Whenever the professor has new information, edit only `data.js`.

| File | Job |
|------|-----|
| `data.js` | ALL editable content (bio, papers, projects, news, contact) |
| `script.js` | Reads `data.js` and builds the page (no need to edit) |
| `index.html` | Page structure (no need to edit) |
| `style.css` | Design and colours (no need to edit) |
| `images/profile.jpg` | The profile photo |

## How to edit `data.js`

- Text goes inside `"double quotes"`.
- Items in a list are separated by commas.
- To add something: copy an existing `{ ... }` block, paste it next to the others (with a comma between blocks), then change the text.
- Leave a field empty (`""`) to hide it. An empty list (`[]`) hides the whole section.

### Add a new publication
Open `data.js`, find `publications: [` and paste a new block at the top:

```javascript
{
    title: "Paper title",
    authors: "Author 1, Author 2",
    venue: "Journal or conference, volume, pages",
    year: "2027",
    link: "https://doi.org/..."
},
```

The website sorts by year automatically and adds the year to the filter buttons.

### Add a new project
Find `projects: [` and add:

```javascript
{
    title: "Project name",
    description: "Short description",
    year: "2027",
    link: ""
},
```

### Add a new research interest
Find `researchInterests: [` and add:

```javascript
{
    title: "New research topic",
    description: "One or two sentences (or leave empty)"
},
```

### Add a news item
Find `news: [` and add at the top:

```javascript
{
    date: "November 2026",
    title: "News headline",
    description: "Short description.",
    link: ""
},
```

### Change the biography
Edit the `about: [ ... ]` list. Each line in quotes is one paragraph.

### Change the profile image
Put the new photo in the `images/` folder and name it **`profile.jpg`** (replace the old one).
A square photo (at least 400 x 400 px) looks best. If no photo is found, a grey placeholder is shown.

## Deploy on GitHub Pages

1. Create a GitHub repository and upload ALL files in this folder (keep `index.html` at the top level).
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then **Save**.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

### Update the website later
1. Open `data.js` on GitHub and click the pencil icon (Edit).
2. Make your change and click **Commit changes**.
3. Wait about a minute and refresh the website.

If the page shows "Could not load data.js", a comma or quote is probably missing near your last edit.

## Test on your own computer
Double-click `index.html` to open it in your browser. No server is needed.
