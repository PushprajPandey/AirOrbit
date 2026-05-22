import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type RpcName = keyof Database['public']['Functions'];

type RpcArgs<K extends RpcName> = Database['public']['Functions'][K]['Args'];

type RpcClient = {
  rpc: (
    fn: string,
    args: Record<string, unknown>
  ) => Promise<{ data: unknown; error: PostgrestError | null }>;
};

export function callRpc<K extends RpcName>(
  client: unknown,
  fn: K,
  args: RpcArgs<K>
): Promise<{ data: unknown; error: PostgrestError | null }> {
  const rpcClient = client as RpcClient;
  return rpcClient.rpc(fn, args as Record<string, unknown>);
}
