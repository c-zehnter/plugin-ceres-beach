<?php

namespace CeresBeach\Containers;

use Plenty\Plugin\Templates\Twig;

class CeresBeachItemListContainer1
{
    public function call(Twig $twig, $arg):string
    {
        return $twig->render('CeresBeach::Containers.ItemLists.ItemList1', ["item" => $arg[0]]);
    }
}