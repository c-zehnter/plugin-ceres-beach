<?php

namespace CeresBeach\Containers;

use Plenty\Plugin\Templates\Twig;

class CeresBeachItemListContainer3
{
    public function call(Twig $twig, $arg):string
    {
        return $twig->render('CeresBeach::Containers.ItemLists.ItemList3', ["item" => $arg[0]]);
    }
}