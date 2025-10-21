export type PageRow = {
  slug: string;
  title: string | null;
  h1: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  content_html: string | null;
  schema_json: any | null; // @graph array w/ FAQPage + LocalBusiness
  status: 'draft' | 'published' | null;
};
