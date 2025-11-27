# 📚 Student Exam Submission System

A React-based exam submission form that integrates with Supabase for file storage and data management.

## ✨ **Features**

### **Form Fields**
- **Student Selection**: Dropdown populated from registrations table
- **Group Selection**: G, B, V, A, Armonie
- **Theory Answer**: Large textarea for written responses
- **Exam File Upload**: PDF, JPG, PNG files (max 50MB)
- **Performance File Upload**: MP4, MOV, MP3, WAV files (max 50MB)

### **File Management**
- **Supabase Storage**: Files stored in organized folder structure
- **Progress Tracking**: Real-time upload progress indicators
- **File Validation**: Type and size validation
- **Unique Naming**: Prevents filename conflicts

### **Data Storage**
- **Exams Table**: Stores exam submissions with file URLs
- **Student Reference**: Links to registration data
- **Audit Trail**: Timestamps and metadata

## 🗄️ **Database Schema**

### **Exams Table**
```sql
CREATE TABLE exams (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES registrations(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  group_name TEXT NOT NULL CHECK (group_name IN ('G', 'B', 'V', 'A', 'Armonie')),
  theory_answer TEXT NOT NULL,
  exam_file_url TEXT NOT NULL,
  performance_file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Storage Structure**
```
exams/
├── G/
│   ├── exam-file-1.pdf
│   ├── performance-file-1.mp4
│   └── ...
├── B/
│   ├── exam-file-2.jpg
│   ├── performance-file-2.mov
│   └── ...
└── ...
```

## 🚀 **Setup Instructions**

### **1. Supabase Storage Bucket**
```bash
# Create 'exams' bucket
# Set as public
# Set file size limit to 50MB
```

### **2. Storage Policies**
```sql
-- Allow file uploads
CREATE POLICY "Allow anonymous uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'exams');

-- Allow file viewing
CREATE POLICY "Allow anonymous viewing" ON storage.objects
  FOR SELECT USING (bucket_id = 'exams');
```

### **3. Database Tables**
Run the SQL from `SUPABASE_SETUP.md` to create both tables.

## 🔧 **Usage**

### **Component Import**
```jsx
import StudentExamForm from './components/StudentExamForm';

// Use in your app
<StudentExamForm />
```

### **Form Submission Flow**
1. **Student Selection**: Choose from registered students
2. **Group Assignment**: Select appropriate group
3. **Theory Answer**: Write detailed response
4. **File Uploads**: Select exam and performance files
5. **Validation**: Client-side validation checks
6. **Upload**: Files uploaded to Supabase Storage
7. **Database**: Exam data saved to exams table
8. **Success**: Confirmation message displayed

## 📁 **File Upload Details**

### **Accepted Formats**
- **Exam Files**: PDF, JPG, JPEG, PNG
- **Performance Files**: MP4, MOV, MP3, WAV

### **Size Limits**
- **Maximum**: 50MB per file
- **Recommended**: Under 25MB for better performance

### **Storage Organization**
- Files organized by group (G, B, V, A, Armonie)
- Unique filenames prevent conflicts
- Public URLs for easy access

## 🎨 **Styling & UI**

### **Design Features**
- **Responsive Layout**: Works on all device sizes
- **Progress Indicators**: Visual upload progress
- **File Information**: Shows selected file details
- **Validation Messages**: Clear error and success feedback
- **Modern UI**: Clean, professional appearance

### **CSS Classes**
- `.exam-form-container`: Main container
- `.exam-form`: Form element
- `.form-row`: Two-column layout
- `.file-info`: File details display
- `.upload-progress`: Progress bar styling

## 🔒 **Security & Validation**

### **Client-Side Validation**
- Required field checking
- File type validation
- File size validation
- Age verification (from registration)

### **Server-Side Security**
- Supabase RLS policies
- File type restrictions
- Size limits enforced
- Anonymous access control

## 📱 **Responsive Design**

### **Breakpoints**
- **Desktop**: 2-column layout
- **Tablet**: Single column, adjusted spacing
- **Mobile**: Optimized for touch, compact layout

### **Mobile Features**
- Touch-friendly file inputs
- Swipe navigation between forms
- Optimized button sizes
- Readable typography

## 🧪 **Testing**

### **Test Scenarios**
1. **Valid Submission**: All fields filled, files uploaded
2. **Missing Fields**: Test required field validation
3. **Invalid Files**: Wrong file types/sizes
4. **Large Files**: Test size limit enforcement
5. **Network Issues**: Handle upload failures gracefully

### **Test Data**
- Create test students in registrations table
- Prepare sample files in various formats
- Test with different group selections

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"Bucket not found"**
   - Verify 'exams' bucket exists
   - Check bucket permissions

2. **"Upload failed"**
   - Check file size limits
   - Verify file type acceptance
   - Check network connection

3. **"Student not found"**
   - Ensure registrations table has data
   - Check student ID references

4. **"Permission denied"**
   - Verify storage policies
   - Check RLS settings

### **Debug Steps**
1. Check browser console for errors
2. Verify Supabase connection
3. Test storage bucket access
4. Check database permissions

## 🔮 **Future Enhancements**

### **Planned Features**
- **Batch Uploads**: Multiple file selection
- **File Preview**: Image/PDF previews
- **Progress Persistence**: Resume interrupted uploads
- **Admin Dashboard**: View and manage submissions
- **Email Notifications**: Submission confirmations

### **Integration Options**
- **Authentication**: User login system
- **File Compression**: Automatic optimization
- **CDN Integration**: Faster file delivery
- **Backup System**: Automatic file backups

## 📞 **Support**

- **Documentation**: Check Supabase docs
- **Issues**: Review error messages in console
- **Community**: Supabase Discord/forums
- **Code**: Review component source code

---

**Note**: This system requires both the `registrations` and `exams` tables to be set up in Supabase, along with the `exams` storage bucket.






