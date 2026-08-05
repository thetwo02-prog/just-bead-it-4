Put photos of your finished pieces in this folder.

Naming: lowercase, no spaces — e.g. shaded-heart.jpg, blue-fox.jpg

Before uploading, resize each photo to about 800-1200px wide and
save as JPEG at ~80% quality. That lands around 80-150KB each.
Straight-from-camera photos (3-6MB) will make the site slow on mobile.

Then in index.html, find "const DESIGNS = [" and add img: to an entry:

  { name:'Shaded Heart', size:'Small', price:'5 AED', tag:'tag-small',
    img:'images/shaded-heart.jpg',
    pat:[ ... ], colors:{ ... } }

  - With BOTH img and pat: shows your photo, still opens in the builder
    so customers can customise it.
  - With ONLY img (no pat/colors): a finished piece, one tap adds it
    straight to the cart at the price you set.
