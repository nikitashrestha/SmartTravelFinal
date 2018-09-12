import re
import nltk
from pickle import dump
from pickle import load
from  nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk.corpus import brown

givenpatterns = [ (r'won\'t' , "will not"),
                  (r'\'s', "is"),
                  (r'\'d', "would"),
                  (r'don\'t', "do not")]


class RegexpReplacer(object):
    def __init__(self):
        self.patterns = givenpatterns

    def replace(self, text):
        for(raw,rep) in self.patterns:
            regex = re.compile(raw)
            text = regex.sub(rep,text)
        return text

class RepeatReplacer(object):
    def __init__(self):
        self.regex = re.compile(r'(\w*)(\w)\2(\w*)')
        self.rep1 = r'\1\2\3'

    def replace(self, word):
        if wordnet.synsets(word):
            return word

        loop_res = self.regex.sub(self.rep1, word)
        if(word == loop_res):
            return loop_res
        else:
            return self.replace(loop_res)

class WordReplacer(object):
    def __init__(self, word_map):
        self.word_map = word_map

    def replace(self, word):
        return self.word_map.get(word, word)

class Query(object):
    def __init__(self):
        self.query_result = []
        self.result=[]
        self.patterns = [(r'^-?[0-9]+(.[0-9]+)?$','CD'),
                         (r'^famous', 'F'), (r'^popular', 'F'), (r'^good', 'F'), (r'^best', 'F'),(r'^nice','F'),(r'^beautiful','F'),(r'^lovely', 'F'),(r'^awesome', 'F'),(r'^top', 'F'),(r'^amazing', 'F'),(r'^nice', 'F'),(r'^renowned', 'F'),(r'^must', 'F'),(r'^most', 'F'),
                         (r'^nepal','N'),(r'^kathmandu','D'),(r'^bhojpur','D'),(r'^dhankuta','D'),(r'^ilam','D'),
                         (r'^jhapa','D'),(r'^khotang','D'),(r'^morang','D'),(r'^okhaldhunga','D'),(r'^panchthar','D'),
                         (r'^sankhuwasabha','D'),(r'^solukhumbu','D'),(r'^ sunsari','D'),(r'^taplejung','D') ,
                         (r'^terhathum','D'),(r'^udayapur','D'),(r'^saptari','D'),(r'^siraha',' D'), (r'^dhanusa','D'),
                         (r'^mahottari','D'), (r'^sarlahi','D'),(r'^bara','D'),(r'^parsa','D'),(r'^rautahat','D'),(r'^sindhuli','D'),(r'^ramechhap','D'),(r'^dolakha','D'),(r'^bhaktapur','D'),(r'^dhading','D'),
                         (r'^kavrepalanchok','D'),(r'^lalitpur','D'),(r'^nuwakot','D'),(r'^rasuwa','D'),
                         (r'^sindhupalchok','D'),(r'^chitwan','D'),(r'^makwanpur','D'),(r'^gorkha','D'),(r'^kaski','D'),(r'^lamjung','D'),(r'^syangja','D'),(r'^tanahu','D'),(r'^manang','D'),(r'^nawalpur','D'),(r'^baglung','D'),(r'^myagdi','D'),(r'^parbat','D'),(r'^mustang','D'),
                         (r'^kapilvastu','D'),(r'^parasi','D'),(r'^rupandehi','D'),(r'^arghakhanchi','D'),(r'^gulmi','D'),(r'^palpa','D'),
                         (r'^dang','D'),(r'^pyuthan','D'),(r'^rolpa','D'),(r'^rukum','D'),(r'^banke','D'),(r'^bardiya','D'),(r'^rukum','D'),
                         (r'^salyan','D'),(r'^dolpa','D'),(r'^humla','D'),(r'^jumla','D'),(r'^kalikot','D'),(r'^mugu','D'),(r'^surkhet','D'),
                         (r'^dailekh','D'),(r'^jajarkot','D'),(r'^kailali','D'),(r'^achham','D'),(r'^doti','D'),(r'^bajhang','D'),(r'^bajura','D'),
                         (r'^kanchanpur','D'),(r'dadeldhura','D'),(r'^baitadi','D'),(r'^darchula','D'),
                         (r'^place','PV'),(r'^destination','PV'),(r'^area','PV'),(r'^site','PV'),
                         (r'^hiking','A'),(r'^hike','A'),(r'^bungee','B'),(r'^bunge','B'),(r'^climbing','C'),(r'^climb','C'),(r'^mountain','C'),(r'^basecamp','C'),(r'^rafting','RA'),(r'^raft','RA'),(r'^trekking','T'),(r'^trek','T'),(r'^hunting','HU'),(r'^hunt','HU'),(r'^sightseeing','A'),(r'^historical','H'),(r'^cultural','H'),(r'^national','H'),(r'^natural','NA'),(r'^paragliding','PG'),
                         (r'^park','PA'),(r'garden','PA'), (r'^heritage','HH'),(r'^building','HH'),
                         (r'^tour','TR'),(r'^travel','TR'),(r'^architectural','H'),(r'^church','TE'),(r'^market','AR'),(r'^art','AR'),(r'^palace','HH'),(r'^museum','M'),(r'^durbar','HH'),(r'^monument','HH'), (r'^lake','L'),(r'^river','R'),(r'^around','NL'),(r'^nearby','NL'),(r'^near','NL'),(r'^wildlife','W'),(r'^temple','TE'),(r'^gumba','TE'),(r'^japanese','CH'),(r'^asian','CH'),(r'^european','CH'),(r'^mix','CH'),(r'^lodge','RE'),(r'^international','CH'),(r'^eastern','CH'),(r'^religious','REL'),(r'^dining','DI'),(r'^dinner','DI'),(r'^diner','DI'),(r'^lunch','DI'),(r'^chinese','CH'),(r'^newari','CH'),(r'^thai','CH'),(r'^italian','CH'),(r'^indian','CH'),(r'^continental','CH'),(r'^french','CH'),(r'^vegan','CH'),(r'^korean','CH'),(r'^nepali','CH'),(r'^indian','CH'),(r'^mexican','CH'),(r'^spanish','CH'),(r'^mediterenian','CH'),(r'^restaurant','RE'),(r'^thakali','RE'),(r'^cafe','RE'),(r'^coffee','RE'),(r'^fastfood','RE'),(r'^b&bs/inns','RE'),(r'^hotel','RE'),(r'^cotage','RE'),(r'^resort','RE'),(r'^lodge','RE'),(r'^bar','RE'),(r'^pub','RE'),(r'^casino','RE'),(r'^guest','RE'),(r'^where','WHH'),(r'^stay','ST')]

    def Process_Query(self,query):

        # Removing stop_words
        stop_words = set(stopwords.words('english'))

        for word in word_tokenize(query):
            if word not in stop_words:
                self.query_result.append(word)

        #Removing repeating characters
        char_rep = RepeatReplacer()

        i = 0
        for word in self.query_result:
             self.query_result[i] = char_rep.replace(word)
             i = i + 1

        # lemmatizing user's query

        lemmas = WordNetLemmatizer()
        my_queryarr2 = []

        for word in self.query_result:
            my_queryarr2.append(lemmas.lemmatize(word))

            self.query_result = my_queryarr2
        del (my_queryarr2)

        #Tagging using regular expression tagger and own tagsets


        output = open('t3.pkl', 'rb')
        tagger = load(output)
        output.close()


        self.result = tagger.tag(self.query_result)
        tag_result=[]
        tag_result1=[]
        for res in self.result:
            if res[1] is not None:
                tag_result.append(res[1])
        return tag_result

    def get_tag_name(self,tag):
        for res in self.result:
            if tag == res[1]:
                tag_word = res[0]
        return tag_word



    def makefile(self):
        t0 = nltk.RegexpTagger(self.patterns)
        output = open('t3.pkl', 'wb')
        dump(t0, output, -1)
        output.close()



