#!/usr/bin/perl

# Copyright 2014 QCRI (author: Ahmed Ali)
# Apache 2.0

use warnings;
use strict;
use Encode;
use utf8;



if (@ARGV !=2 )
    {#
	print "usage: $0 <inFile> <onlyArabicFile>\n"; 
	exit (1);   
    }
    
# <\check usage>
my $inFile = shift (@ARGV);
my $ouFile = shift(@ARGV);


open INFILE, "<$inFile" || die "unable to open the input file $inFile\n";
binmode INFILE, ":encoding(utf8)";


open OUTPUTFILE, ">$ouFile" or die "unable to open the output mlf file $ouFile\n";
binmode OUTPUTFILE, ":encoding(utf8)";


while (<INFILE>) {
  s/[^اأإآبتثجحخدذرزسشصضطظعغفقكلمنهويىئءؤة0-9]+/ /g;  ## Removes any non Arabic
  print OUTPUTFILE "$_"."\n";
}
close INFILE;
close OUTPUTFILE;
