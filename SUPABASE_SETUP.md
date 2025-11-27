# 🗄️ Supabase Database Setup Guide

## 📋 **Required Tables**

### **1. Registrations Table**
Run this SQL in your Supabase SQL Editor:

```sql
-- Create registrations table
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  church TEXT NOT NULL,
  pastor_name TEXT NOT NULL,
  pastor_phone TEXT NOT NULL,
  course_type TEXT NOT NULL CHECK (course_type IN ('G', 'B', 'V', 'A', 'Armonie')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous insert (public registration)
CREATE POLICY "Allow anonymous insert" ON registrations
  FOR INSERT WITH CHECK (true);

-- Create policy for anonymous select (public viewing)
CREATE POLICY "Allow anonymous select" ON registrations
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX idx_registrations_course_type ON registrations(course_type);
CREATE INDEX idx_registrations_church ON registrations(church);
```

### **2. Exams Table (Required for Exam Submission)**
```sql
-- Create exams table
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

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous insert" ON exams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON exams
  FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_exams_created_at ON exams(created_at DESC);
CREATE INDEX idx_exams_group_name ON exams(group_name);
```

## 🔧 **Setup Steps**

### **Step 1: Access Supabase Dashboard**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `nfughcexzavqbnpqumca`

### **Step 2: Create Storage Bucket**
1. Click on "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Name: `exams`
4. Public bucket: ✅ **Yes** (so files can be accessed)
5. File size limit: `50MB`
6. Click "Create bucket"

### **Step 3: Set Storage Policies**
Run this SQL in the SQL Editor to allow file uploads:

```sql
-- Allow anonymous users to upload files to exams bucket
CREATE POLICY "Allow anonymous uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'exams');

-- Allow anonymous users to view files in exams bucket
CREATE POLICY "Allow anonymous viewing" ON storage.objects
  FOR SELECT USING (bucket_id = 'exams');
```

### **Step 4: Open SQL Editor**
1. Click on "SQL Editor" in the left sidebar
2. Click "New query"

### **Step 5: Create Tables**
1. Copy and paste the SQL code above
2. Click "Run" to execute
3. Verify tables are created in "Table Editor"

### **Step 6: Test Connection**
1. Go to your React app
2. Try to submit a registration
3. Check the "Table Editor" to see if data appears
4. Try to submit an exam with file uploads
5. Check the "Storage" section to see uploaded files

## 🚨 **Important Notes**

- **Row Level Security (RLS)** is enabled by default
- **Anonymous access** is allowed for basic operations
- **Consider adding authentication** for admin features later
- **Backup your data** before making schema changes

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Table doesn't exist"**
   - Check if SQL executed successfully
   - Verify table name spelling

2. **"Permission denied"**
   - Check RLS policies
   - Verify API key permissions

3. **"Invalid input"**
   - Check data types match schema
   - Verify required fields are filled

## 📱 **Testing the Form**

1. **Start the React app:**
   ```bash
   npm run dev
   ```

2. **Fill out the registration form**
3. **Submit and check Supabase dashboard**
4. **Verify data appears in the registrations table**

## 🔐 **Security Considerations**

- **API Key Exposure**: Never commit API keys to public repositories
- **RLS Policies**: Review and customize based on your needs
- **Rate Limiting**: Consider implementing rate limiting for production
- **Data Validation**: Always validate data on both client and server

## 📞 **Support**

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
