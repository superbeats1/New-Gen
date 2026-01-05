// ADMIN TOOL: Manually upgrade a user to Pro status
// Usage: node admin-upgrade-user.js user@example.com

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Replace with your service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function upgradeUserToPro(email) {
  try {
    console.log(`Looking for user with email: ${email}`);
    
    // Find user by email
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return;
    }

    const user = authUsers.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`User not found with email: ${email}`);
      return;
    }

    console.log(`Found user: ${user.id}`);

    // Update user to Pro status
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_pro: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select();

    if (updateError) {
      console.error('Error updating user to Pro:', updateError);
      return;
    }

    console.log(`✅ Successfully upgraded ${email} to Pro status!`);
    console.log('Updated profile:', data);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node admin-upgrade-user.js user@example.com');
  process.exit(1);
}

upgradeUserToPro(email);