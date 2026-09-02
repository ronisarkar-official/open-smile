import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isRealtimeConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseClient = isRealtimeConfigured
	? createClient(supabaseUrl, supabaseAnonKey, {
			realtime: {
				params: {
					eventsPerSecond: 10,
				},
			},
	  })
	: null;
