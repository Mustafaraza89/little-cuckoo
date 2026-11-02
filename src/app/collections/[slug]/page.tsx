import { redirect } from 'next/navigation';

export default function CollectionSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/shop?category=${params.slug}`);
}
