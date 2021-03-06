<!-- should be used to handle bloghome, 404 and search -->
<?php get_header(); ?>
<template id="navigation">
  <?php the_posts_pagination( array(
    'mid_size'  => 2,
    'prev_text' => __( 'Back', 'swcc_setup' ),
    'next_text' => __( 'Onward', 'swcc_setup' ),
) ); ?>
</template>
<main 
  class="site-main"
  is="swcc-main"
  page-type="indexPage" 
  page-id="<?= the_ID(); ?>"
  page-number="<?= $paged ?>" 
></main>
<?php get_footer(); ?>
