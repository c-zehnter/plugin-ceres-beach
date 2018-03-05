<?php

namespace CeresBeach\Containers;

use Plenty\Plugin\Templates\Twig;

class CeresBeachItemListContainer2
{
    public function call(Twig $twig, $arg):string
    {
        return $twig->render('CeresBeach::Containers.ItemLists.ItemList2', ["item" => $arg[0]]);
    }
}