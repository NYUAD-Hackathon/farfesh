from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from datetime import datetime
import os
import json
import tweepy
import codecs
import sys  
reload(sys)  
sys.setdefaultencoding('utf8')

# Output directory to hold json files (one per day) with tweets
# Within the output directory, the script loads a file named FILTER with the terms to be tracked (one per line)

outputDir = "tweetDir"

## End of Settings###

class FileDumperListener(StreamListener):

	def __init__(self,filepath):
		super(FileDumperListener,self).__init__(self)
		self.basePath=filepath
		os.system("mkdir -p %s"%(filepath))

		d=datetime.today()
		self.filename = "%i-%02d-%02d.en.tweets"%(d.year,d.month,d.day)		
		self.fh = codecs.open(self.basePath + "/" + self.filename,"a","utf-8")#open for appending just in case
		
		self.tweetCount=0
		self.errorCount=0
		self.limitCount=0
		self.last=datetime.now()
	
	#This function gets called every time a new tweet is received on the stream
	def on_data(self, data):
		self.fh.write(data)
		self.tweetCount+=1
		
		#Status method prints out vitals every five minutes and also rotates the log if needed
		self.status()
		return True
		
	def close(self):
		try:
			self.fh.close()
		except:
			#Log/email
			pass
	
	#Rotate the log file if needed.
	#Warning: Check for log rotation only occurs when a tweet is received and not more than once every five minutes.
	#		  This means the log file could have tweets from a neighboring period (especially for sparse streams)
	def rotateFiles(self):
		d=datetime.today()
		filenow = "%i-%02d-%02d.en.json"%(d.year,d.month,d.day)
		if (self.filename!=filenow):
			print("%s - Rotating log file. Old: %s New: %s"%(datetime.now(),self.filename,filenow))
			try:
				self.fh.close()
			except:
				#Log/Email it
				pass
			self.filename=filenow
			self.fh = codecs.open(self.basePath + "/" + self.filename,"a","utf-8")

	def on_error(self, statusCode):
		print("%s - ERROR with status code %s"%(datetime.now(),statusCode))
		self.errorCount+=1
	
	def on_timeout(self):
		raise TimeoutException()
	
	def on_limit(self, track):
		print("%s - LIMIT message recieved %s"%(datetime.now(),track))
		self.limitCount+=1
	
	def status(self):
		now=datetime.now()
		if (now-self.last).total_seconds()>300:
			print("%s - %i tweets, %i limits, %i errors in previous five minutes."%(now,self.tweetCount,self.limitCount,self.errorCount))
			self.tweetCount=0
			self.limitCount=0
			self.errorCount=0
			self.last=now
			self.rotateFiles()#Check if file rotation is needed
		

class TimeoutException(Exception):
	pass

if __name__ == '__main__':
	while True:
		try:
			#Create the listener
			listener = FileDumperListener(outputDir)
			auth = tweepy.OAuthHandler("PGZQCVSYxYCG0QDvW0NoJqFbS", "8LFgea5J3jMIjFXRQ3OwZjUITjyLmMZZx8esmPtywDtjsU1bFF")
                        auth.set_access_token("242918456-jwmSL9WdGz2SwkQNHbzVoEmhfzAdVDRGF2aW1KfH", "gIj0664b2tdZEd4gREl08ch1AvotTr3SK7F88nvZNW1rw")

			fhTerms = codecs.open(outputDir+"/FILTER.EN","r","utf-8")
			terms=[]
			for line in fhTerms:
				terms.append(line.strip())
			print("%s - Starting stream to track %s"%(datetime.now(),",".join(terms)))

			#Connect to the Twitter stream
			stream = Stream(auth, listener)
			#stream.filter(locations=[-0.530, 51.322, 0.231, 51.707])#Tweets from London
			stream.filter(track=terms)

		except KeyboardInterrupt:
			#User pressed ctrl+c or cmd+c -- get ready to exit the program
			print("%s - KeyboardInterrupt caught. Closing stream and exiting."%datetime.now())
			listener.close()
			stream.disconnect()
			break
		except TimeoutException:
			#Timeout error, network problems? reconnect.
			print("%s - Timeout exception caught. Closing stream and reopening."%datetime.now())
			try:
				listener.close()
				stream.disconnect()
			except:
				pass
			continue
