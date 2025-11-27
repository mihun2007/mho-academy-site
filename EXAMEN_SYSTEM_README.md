# 📚 Music School Exam Management System

A simple two-page system for managing and viewing exam download links using localStorage.

## 📁 Files

- **`admin.html`** - Admin page for teachers to add/edit/delete exams
- **`examene.html`** - Student page to view and download exams by group

## 🚀 Features

### Admin Page (`admin.html`)
- ✅ Add new exams with title, group, and download link
- ✅ View all added exams in a list
- ✅ Delete individual exams
- ✅ Copy exam links to clipboard
- ✅ Clear all exams button
- ✅ Success/error notifications

### Student Page (`examene.html`)
- ✅ View exams grouped by group (G, B, V, A, Armonie)
- ✅ Search exams by title
- ✅ Download buttons open links in new tab
- ✅ Clean, organized display

## 🎨 Design Features

- **Pastel Colors**: Soft, pleasant color scheme
- **Rounded Cards**: Modern, friendly appearance
- **Responsive**: Works on mobile and desktop
- **Clean UI**: Minimal, easy to use
- **Smooth Animations**: Hover effects and transitions

## 📝 Usage Instructions

### For Teachers (Admin)

1. **Open `admin.html`** in your browser
2. **Fill in the form**:
   - Enter exam title (e.g., "Examen de teorie - grupa G")
   - Select the group (G, B, V, A, or Armonie)
   - Paste the download link (Google Drive, Dropbox, etc.)
3. **Click "Salvează Examen"** to save
4. **Manage exams**:
   - Use "Copiază Link" to copy the link
   - Use "Șterge" to delete an exam
   - Use "Șterge Toate Examenele" to clear all

### For Students

1. **Open `examene.html`** in your browser
2. **Browse exams** grouped by your group
3. **Search** for specific exams using the search box
4. **Click "Descarcă"** to download (opens in new tab)

## 💾 Data Storage

- All data is stored in **localStorage** (browser storage)
- Key: `examene`
- Data persists across page refreshes
- **Note**: Data is browser-specific (not synced across devices)

## 🎯 Example Usage

### Adding an Exam
1. Title: "Examen de teorie - grupa G"
2. Group: G
3. Link: https://drive.google.com/file/d/1ABC123...

### Result
- Students in group G will see this exam on `examene.html`
- They can click "Descarcă" to download

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks needed
- **localStorage API** - Client-side storage
- **Responsive Design** - Mobile-first approach
- **No Backend** - Everything runs in the browser

## 📱 Mobile Support

Both pages are fully responsive and work on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🎨 Color Scheme

- **Primary Gold**: #d69e2e
- **Background**: Pastel cream gradient
- **Cards**: White with soft shadows
- **Groups**: Different colors for each group

## 🚨 Important Notes

- **localStorage limits**: ~5-10MB per domain
- **Browser-specific**: Data doesn't sync across browsers/devices
- **No authentication**: Anyone with access can view/edit
- **Backup recommended**: Export data regularly if needed

## 🔮 Future Enhancements (Optional)

- Export/Import functionality
- User authentication
- Backend database integration
- Bulk import/export
- Admin dashboard with statistics

---

**Made with ❤️ for music schools**



