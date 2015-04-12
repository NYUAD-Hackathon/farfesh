#!/usr/bin/env perl

use strict;
use URI::Escape;

my $language = $ARGV[0];

binmode(STDIN, ":utf8");

while (my $line = <STDIN>) {
	chomp($line);
	print STDERR "line=$line\n";
	
	my $tmpFile = "./sentistrength.$$";
	my $cmd = "curl -o $tmpFile ";
	#$cmd .= "\"http://sentistrength.wlv.ac.uk/results.php?text=je+suis+malade&submit=Detect+Sentiment+in+French\"";
	
	$cmd .= "\"http://sentistrength.wlv.ac.uk/results.php?text=";
	my $safe = uri_escape_utf8($line);
	$cmd .= $safe;	
	$cmd .= "&submit=Detect+Sentiment+in+" .$language ."\"";
	
	print STDERR "cmd=$cmd\n";
	`$cmd`;
	
	my $sentiment = GetSentiment($tmpFile);
	print STDERR "sentiment=$sentiment \n";
	
	if ($sentiment > 1) {
  	print "$line\n";
  }
}

########################################
sub GetSentiment
{
  my $filePath = shift;
  open(FILE, $filePath);
  
  while (my $line = <FILE>) {
		chomp($line);
	
		# positive
		my $sought = "has positive strength";
		my $soughtLen = length($sought);
	
		my $start = index($line, $sought);
		if ($start != -1) {
			#print STDERR "ind=$start line=$line \n";
		
			$start = $start + $soughtLen + 4;
			my $end = index($line, "<", $start);
		
			my $posStrength = substr($line, $start, $end - $start);
			print STDERR "posStrength=$posStrength\n";
		
			# negative
			my $sought = "and negative strength";
			my $soughtLen = length($sought);
	
			my $start = index($line, $sought, $end);
		
			$start = $start + $soughtLen + 4;
			my $end = index($line, "<", $start);
		
			my $negStrength = substr($line, $start, $end - $start);
			print STDERR "negStrength=$negStrength\n";
		
			my $ret = $posStrength + $negStrength;
			return $ret;
		}	

	}


}
