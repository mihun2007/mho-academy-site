# Cursuri MHO - Music Course Platform

A modern responsive website for music course registration with Supabase integration.

## 🚀 **Quick Start**

### **Option 1: Using Supabase (Recommended)**
1. Include the Supabase client in your HTML:
```html
<script src="supabaseClient-vanilla.js"></script>
```

2. Use Supabase functions in your JavaScript:
```javascript
// Wait for Supabase to be ready
window.addEventListener('supabaseReady', function() {
  // Save registration
  window.supabaseFunctions.saveRegistration({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    church: 'St. Mary Church',
    servantName: 'Father Smith',
    servantPhone: '+1234567890'
  });
  
  // Get all registrations
  window.supabaseFunctions.getRegistrations().then(result => {
    if (result.success) {
      console.log('Registrations:', result.data);
    }
  });
});
```

### **Option 2: Direct Supabase Usage**
```javascript
// Use Supabase directly
const { data, error } = await window.supabase
  .from('registrations')
  .select('*');
```

## 🗄️ **Database Setup**

Create these tables in your Supabase project:

### **Registrations Table**
```sql
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  church TEXT NOT NULL,
  servant_name TEXT NOT NULL,
  servant_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Exams Table**
```sql
CREATE TABLE exams (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  course TEXT NOT NULL,
  group_name TEXT NOT NULL,
  theory_file_url TEXT,
  performance_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 **Development**

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
python3 -m http.server 8000
```

## 📁 **File Structure**

- `index.html` - Homepage
- `courses.html` - Course listings
- `register.html` - Registration form
- `exam.html` - Exam submission
- `exam-muzical.html` - Musical exam
- `admin.html` - Admin dashboard
- `supabaseClient.js` - ES6 module version
- `supabaseClient-vanilla.js` - Vanilla JS version
- `supabase-example.js` - Usage examples

## 🌐 **Supabase Configuration**

- **Project URL**: `https://nfughcexzavqbnpqumca.supabase.co`
- **API Key**: Configured in client files
- **Database**: PostgreSQL with real-time subscriptions

## 🔒 **Security**

- Row Level Security (RLS) enabled by default
- Anonymous access for public operations
- Consider adding authentication for admin features

## 🚀 **Future React/Next.js Migration**

When you're ready to migrate to React/Next.js:

1. Use `supabaseClient.js` (ES6 module)
2. Import: `import { supabase } from './supabaseClient'`
3. Use in components: `const { data } = await supabase.from('table').select()`

## 📞 **Support**

For Supabase issues, check the [Supabase Documentation](https://supabase.com/docs).






