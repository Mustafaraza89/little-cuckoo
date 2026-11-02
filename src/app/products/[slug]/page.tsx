import { redirect } from 'next/navigation';

export default function ProductSlugAlias({ params }: { params: { slug: string } }) {
  redirect(`/product/${params.slug}`);
}
