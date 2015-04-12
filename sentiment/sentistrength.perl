#!/usr/bin/env perl

use strict;
use URI::Escape;

binmode(STDIN, ":utf8");

while (my $line = <STDIN>) {
	chomp($line);
	print STDERR "line=$line\n";
	
	my $tmpFile = "./sentistrength.$$";
	my $cmd = "curl -o $tmpFile  http://sentistrength.wlv.ac.uk/results.php?text=";
	my $safe = uri_escape_utf8($line);
	$cmd .= $safe;
	
	$cmd .= "%D9%88%D8%B4%D9%81%D8%AA+%D9%83%D9%84%D8%A7%D9%85%D9%83+%D9%87%D8%B0%D8%A7+%D9%8A%D8%B1%D9%81%D8%B9+%D8%B3%D8%B9%D9%8A%D8%AF+%D8%A8%D9%8A%D9%86+%D8%A7%D9%84%D9%83%D9%84+%D9%84%D8%A7%D9%86%D9%87+%D9%85%D9%86+%D8%B7%D9%88%D9%84+%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D9%87+%28%D9%88%D8%A7%D8%AB%D9%82+%D8%A7%D9%84%D8%AE%D8%B7%D9%88%D9%87+%D9%8A%D9%85%D8%B4%D9%8A+%D9%85%D9%84%D9%83+%29%D9%8A%D8%A7%D8%AD%D8%A8%D9%8A+%D9%84%D9%8A%D8%AA%D9%83+%D8%AA%D8%AF%D9%82+%D8%B9%D9%84%D9%8A%D9%87+%D9%88%D9%8A%D8%B9%D8%B7";
	
	#$cmd .= $line;
	
	$cmd .= "&submit=Detect+Sentiment+in+Arabic";
	
	print STDERR "cmd=$cmd\n";
	`$cmd`;
	
	my $sentiment = GetSentiment($tmpFile);
	print STDERR "sentiment=$sentiment \n";
	print "$sentiment\n";
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
