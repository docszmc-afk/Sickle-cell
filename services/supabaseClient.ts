import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvatiiyguuxtepnzhoaz.supabase.co';
const supabaseKey = 'sb_publishable_FKPnnXMyA79wWvhdssfugA_F0X-QP8M';

export const supabase = createClient(supabaseUrl, supabaseKey);