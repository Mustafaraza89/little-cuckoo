export interface BabyImageItem {
  id: string;
  category: string;
  title: string;
  url: string;
  alt: string;
  paletteColor: string;
}

export const CATEGORY_IMAGE_REGISTRY: Record<string, BabyImageItem[]> = {
  newborn: [
    {
      id: 'nb-1',
      category: 'Newborn Collection',
      title: 'Newborn Organic Kimono Tie Top',
      url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
      alt: 'Organic cotton newborn kimono top in vanilla cream',
      paletteColor: '#FFF8ED',
    },
    {
      id: 'nb-2',
      category: 'Newborn Collection',
      title: 'Hospital Bag Footed Onesie',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85',
      alt: 'Baby girl newborn footed romper in strawberry pink',
      paletteColor: '#F3848F',
    },
  ],
  boy: [
    {
      id: 'boy-1',
      category: 'Baby Boy Clothing',
      title: 'Sky Blue Waffle Henley Romper',
      url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85',
      alt: 'Baby boy waffle romper in baby blue',
      paletteColor: '#3689BA',
    },
    {
      id: 'boy-2',
      category: 'Baby Boy Clothing',
      title: 'Organic Striped Overalls & Tee',
      url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=85',
      alt: 'Baby boy overalls set',
      paletteColor: '#C8E6D5',
    },
  ],
  girl: [
    {
      id: 'girl-1',
      category: 'Baby Girl Clothing',
      title: 'Heirloom Hand-Smocked Dress',
      url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=85',
      alt: 'Baby girl smocked heirloom dress in strawberry pastel',
      paletteColor: '#F3848F',
    },
    {
      id: 'girl-2',
      category: 'Baby Girl Clothing',
      title: 'Floral Flutter-Sleeve Frock',
      url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85',
      alt: 'Baby girl floral cotton frock',
      paletteColor: '#F8E5A6',
    },
  ],
  unisex: [
    {
      id: 'uni-1',
      category: 'Unisex Clothing',
      title: 'CloudSoft Ribbed Organic Romper',
      url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85',
      alt: 'Unisex neutral organic ribbed romper',
      paletteColor: '#FFF8ED',
    },
  ],
  rompers: [
    {
      id: 'rmp-1',
      category: 'Rompers & Bodysuits',
      title: 'Two-Way Zip Sleep & Play Romper',
      url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85',
      alt: 'Two-way zip baby romper in strawberry pink',
      paletteColor: '#F3848F',
    },
  ],
  dresses: [
    {
      id: 'drs-1',
      category: 'Baby Dresses',
      title: 'Little Flora Voile Dress & Bloomer',
      url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=85',
      alt: 'Pastel baby dress and bloomers',
      paletteColor: '#DCD0F0',
    },
  ],
  sleepwear: [
    {
      id: 'slp-1',
      category: 'Sleepwear & Swaddles',
      title: 'Sweet Dreams Bamboo Sleepsuit',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85',
      alt: 'Mint green breathable baby sleepsuit',
      paletteColor: '#C8E6D5',
    },
  ],
  gifts: [
    {
      id: 'gft-1',
      category: 'Gift Sets & Keepsakes',
      title: 'Keepsake Box Baby Shower Hamper',
      url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=85',
      alt: 'Luxury baby shower gift hamper with rattle',
      paletteColor: '#FFF8ED',
    },
  ],
};

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85';
