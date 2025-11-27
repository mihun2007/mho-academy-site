-- Supabase exam_results table setup
-- Run this in your Supabase SQL Editor

-- Create the exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
    id BIGSERIAL PRIMARY KEY,
    student_id TEXT NOT NULL,
    group_name TEXT NOT NULL,
    theory_answers TEXT NOT NULL,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous insert (public exam submission)
CREATE POLICY "Allow anonymous insert" ON exam_results
    FOR INSERT WITH CHECK (true);

-- Create policy for anonymous select (public viewing)
CREATE POLICY "Allow anonymous select" ON exam_results
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_results_created_at ON exam_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_results_group_name ON exam_results(group_name);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);

-- Optional: Add some sample data for testing
-- INSERT INTO exam_results (student_id, group_name, theory_answers, video_url) VALUES
-- ('John Doe', 'G', 'Course: ORNI, Theory File: theory_test.pdf', 'Performance File: performance.mp4'),
-- ('Jane Smith', 'B', 'Course: String Instruments, Theory File: theory_answers.jpg', 'Performance File: violin_recording.mov');

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'exam_results'
ORDER BY ordinal_position;






