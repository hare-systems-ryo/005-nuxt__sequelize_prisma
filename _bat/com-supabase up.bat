
@echo off
cd ..
call npx supabase stop
call npx supabase start 
cmd /k

