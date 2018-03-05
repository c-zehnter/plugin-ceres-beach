<?php

namespace CeresBeach\Containers;

use Plenty\Plugin\Templates\Twig;

class CeresBeachContainer
{
    public function call(Twig $twig):string
    {
        return $twig->render('CeresBeach::Stylesheet');
    }
}