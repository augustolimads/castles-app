/**
 * Tipos do Schema do Supabase
 *
 * Estes tipos são gerados manualmente baseados no schema SQL.
 * Para gerar automaticamente, use: npx supabase gen types typescript
 */

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

/**
 * Schema do banco de dados
 */
export interface Database {
	public: {
		Tables: {
			user_profiles: {
				Row: {
					id: string;
					email: string;
					created_at: string;
					last_sync_at: string | null;
				};
				Insert: {
					id?: string;
					email: string;
					created_at?: string;
					last_sync_at?: string | null;
				};
				Update: {
					id?: string;
					email?: string;
					created_at?: string;
					last_sync_at?: string | null;
				};
				Relationships: [];
			};
			user_data: {
				Row: {
					id: string;
					user_id: string;
					data_key: string;
					data_value: Json;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					data_key: string;
					data_value: Json;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					data_key?: string;
					data_value?: Json;
					updated_at?: string;
				};
				Relationships: [];
			};
		  compendium_v2_entries: {
			  Row: {
				  id: string;
				  user_id: string;
				  nome: string;
				  thumbnail: string | null;
				  data: Json;
				  category: string;
				  tags: string[];
				  created_at: string;
				  updated_at: string;
			  };
			  Insert: {
				  id?: string;
				  user_id: string;
				  nome: string;
				  thumbnail?: string | null;
				  data: Json;
				  category: string;
				  tags?: string[];
				  created_at?: string;
				  updated_at?: string;
			  };
			  Update: {
				  id?: string;
				  user_id?: string;
				  nome?: string;
				  thumbnail?: string | null;
				  data?: Json;
				  category?: string;
				  tags?: string[];
				  created_at?: string;
				  updated_at?: string;
			  };
			  Relationships: [];
		  };
	  };
	  Views: Record<string, never>;
	  Functions: Record<string, never>;
	  Enums: Record<string, never>;
  };
}

/**
 * Tipos auxiliares para facilitar o uso
 */
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type UserData = Database["public"]["Tables"]["user_data"]["Row"];

/**
 * Tipo para inserção de dados do usuário
 */
export type UserDataInsert =
	Database["public"]["Tables"]["user_data"]["Insert"];

/**
 * Tipo para atualização de dados do usuário
 */
export type UserDataUpdate =
	Database["public"]["Tables"]["user_data"]["Update"];
