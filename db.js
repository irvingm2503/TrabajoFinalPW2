const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://viqgkaptdnjojipknlgj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcWdrYXB0ZG5qb2ppcGtubGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NDkyOTIsImV4cCI6MjA0ODUyNTI5Mn0.m6CI-BKJxwjmu4DfX5JjTC4Kw-v4bhUYAl_fWEOgRfw';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
