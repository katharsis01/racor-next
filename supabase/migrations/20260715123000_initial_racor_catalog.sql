-- RACOR Cycling: catálogo público y base de conocimiento del asistente.
-- Esta migración no almacena conversaciones, datos personales ni credenciales.

create table if not exists public.products (
  id text primary key,
  handle text not null unique,
  title text not null,
  description text not null,
  category text not null check (
    category in (
      'maillots',
      'manga-larga',
      'termicos',
      'chaquetas',
      'chalecos',
      'culottes-cortos',
      'culottes-largos'
    )
  ),
  tag text,
  image jsonb not null default '{}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  long_description text[] not null default '{}',
  features text[] not null default '{}',
  similar_handles text[] not null default '{}',
  tech_drawing jsonb,
  fabrics jsonb not null default '[]'::jsonb,
  attributes text[] not null default '{}',
  product_details jsonb not null default '{}'::jsonb,
  price_amount numeric(10, 2) check (price_amount is null or price_amount >= 0),
  price_currency char(3) not null default 'EUR',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  search_document tsvector not null default ''::tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_articles (
  id bigint generated always as identity primary key,
  slug text not null unique,
  topic text not null,
  title text not null,
  content text not null,
  related_product_handle text references public.products(handle)
    on update cascade on delete set null,
  source_url text,
  is_published boolean not null default false,
  search_document tsvector not null default ''::tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_status_idx
  on public.products (category, status);
create index if not exists products_attributes_idx
  on public.products using gin (attributes);
create index if not exists products_search_document_idx
  on public.products using gin (search_document);
create index if not exists knowledge_articles_topic_published_idx
  on public.knowledge_articles (topic, is_published);
create index if not exists knowledge_articles_search_document_idx
  on public.knowledge_articles using gin (search_document);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

-- PostgreSQL no permite usar array_to_string dentro de una columna generada
-- porque no se considera inmutable. Estos triggers mantienen el mismo índice
-- de búsqueda de forma compatible con Supabase.
create or replace function public.set_product_search_document()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.search_document = pg_catalog.to_tsvector(
    'pg_catalog.spanish'::regconfig,
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(pg_catalog.array_to_string(new.features, ' '), '') || ' ' ||
    coalesce(pg_catalog.array_to_string(new.long_description, ' '), '')
  );
  return new;
end;
$$;

create or replace function public.set_knowledge_search_document()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.search_document = pg_catalog.to_tsvector(
    'pg_catalog.spanish'::regconfig,
    coalesce(new.title, '') || ' ' || coalesce(new.content, '')
  );
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists knowledge_articles_set_updated_at on public.knowledge_articles;
create trigger knowledge_articles_set_updated_at
before update on public.knowledge_articles
for each row execute function public.set_updated_at();

drop trigger if exists products_set_search_document on public.products;
create trigger products_set_search_document
before insert or update of title, description, features, long_description
on public.products
for each row execute function public.set_product_search_document();

drop trigger if exists knowledge_articles_set_search_document
  on public.knowledge_articles;
create trigger knowledge_articles_set_search_document
before insert or update of title, content
on public.knowledge_articles
for each row execute function public.set_knowledge_search_document();

alter table public.products enable row level security;
alter table public.knowledge_articles enable row level security;

revoke all on table public.products from anon, authenticated;
revoke all on table public.knowledge_articles from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant select on table public.knowledge_articles to anon, authenticated;

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
on public.products
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read published knowledge" on public.knowledge_articles;
create policy "Public can read published knowledge"
on public.knowledge_articles
for select
to anon, authenticated
using (is_published = true);

create or replace function public.search_racor_knowledge(
  query_text text,
  match_count integer default 8
)
returns table (
  source_type text,
  source_id text,
  handle text,
  title text,
  content text,
  rank real
)
language sql
stable
security invoker
set search_path = ''
as $$
  with search_query as (
    select websearch_to_tsquery(
      'pg_catalog.spanish',
      coalesce(query_text, '')
    ) as value
  ),
  ranked_results as (
    select
      'product'::text as source_type,
      product.id::text as source_id,
      product.handle,
      product.title,
      product.description ||
        case
          when cardinality(product.features) > 0
          then E'\n' || array_to_string(product.features, E'\n')
          else ''
        end as content,
      ts_rank_cd(product.search_document, search_query.value)::real as rank
    from public.products as product
    cross join search_query
    where
      product.status = 'published'
      and product.search_document @@ search_query.value

    union all

    select
      'knowledge'::text as source_type,
      article.id::text as source_id,
      article.related_product_handle as handle,
      article.title,
      article.content,
      ts_rank_cd(article.search_document, search_query.value)::real as rank
    from public.knowledge_articles as article
    cross join search_query
    where
      article.is_published = true
      and article.search_document @@ search_query.value
  )
  select *
  from ranked_results
  order by rank desc
  limit greatest(1, least(coalesce(match_count, 8), 20));
$$;

revoke all on function public.search_racor_knowledge(text, integer) from public;
grant execute on function public.search_racor_knowledge(text, integer)
  to anon, authenticated;

insert into public.knowledge_articles (
  slug,
  topic,
  title,
  content,
  source_url,
  is_published
)
values
  (
    'pedidos-y-diseno',
    'pedidos',
    'Pedido mínimo y diseño',
    'RACOR trabaja desde una sola prenda, sin pedido mínimo. El diseño personalizado está incluido sin coste adicional.',
    '/nosotros#proceso',
    true
  ),
  (
    'plazo-de-produccion',
    'entrega',
    'Plazo de producción',
    'El plazo orientativo es de cuatro semanas, aproximadamente treinta días, desde la aprobación definitiva del diseño. Las fechas concretas deben confirmarse con RACOR.',
    '/nosotros#proceso',
    true
  ),
  (
    'tallaje',
    'tallaje',
    'Tallas y kit de tallaje',
    'Las prendas están disponibles de XS a 3XL. Existe una guía y un recomendador de tallas. Para clubes y equipos se puede solicitar un kit de tallaje antes de producir.',
    '/tallaje',
    true
  ),
  (
    'proceso-de-personalizacion',
    'personalizacion',
    'Proceso de personalización',
    'El proceso consta de cuatro pasos: explicar la idea, seleccionar prendas y tallas, revisar propuestas de diseño hasta la aprobación y producir en Madrid con control de calidad.',
    '/nosotros#proceso',
    true
  ),
  (
    'condiciones-de-pago',
    'pago',
    'Condiciones de pago',
    'La condición publicada es un cincuenta por ciento de anticipo y el cincuenta por ciento restante antes de la entrega, mediante transferencia bancaria.',
    '/nosotros#condiciones',
    true
  ),
  (
    'fabricacion-en-madrid',
    'fabricacion',
    'Diseño y fabricación',
    'RACOR diseña, desarrolla y confecciona en Madrid con tejidos nacionales y producción bajo demanda para evitar excedentes de stock.',
    '/nosotros',
    true
  ),
  (
    'presupuestos',
    'precio',
    'Presupuestos personalizados',
    'Los precios se preparan mediante presupuesto porque dependen del diseño, las prendas y las cantidades. El asistente no debe inventar precios no confirmados.',
    '/contacto',
    true
  ),
  (
    'cuidados-generales',
    'cuidados',
    'Cuidados generales de las prendas',
    'Como orientación general: lavar del revés a un máximo de treinta grados, no usar suavizante, lejía ni secadora, secar a la sombra y no planchar. Siempre prevalece la etiqueta interior de cada prenda.',
    '/prendas',
    true
  )
on conflict (slug) do update set
  topic = excluded.topic,
  title = excluded.title,
  content = excluded.content,
  source_url = excluded.source_url,
  is_published = excluded.is_published,
  updated_at = now();
