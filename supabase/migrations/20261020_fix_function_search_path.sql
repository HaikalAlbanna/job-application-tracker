-- Fix Function Search Path Mutable warning on public.set_updated_at
alter function public.set_updated_at() set search_path = '';
