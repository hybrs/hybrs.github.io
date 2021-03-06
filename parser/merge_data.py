import util as u
import io
import json
import pickle

version = "pers"
destination_path = "p_"+version+".txt"
auth_file = "a_"+version+".txt"
prefix = ""


files = []
papers = []
journals = u.rebuild_journals()

print("Merging all filtered files")
with io.open("parsed_files.txt", mode='r', encoding = 'utf8') as f:
    for line in f:
        filename = unicode((line.split("/")[-1]).split(".")[0]+"-filtered")
        fn = line.split("/")[-1]
        if not fn in files:
            files.append(fn)
            papers = papers + u.getP(prefix+filename)

print("Merged "+str(len(files))+" filtered files")
print(str(len(papers))+" papers and "+str(len(journals))+" journals/venues")

#Counting papers per journal/venue
for p in papers:
    kj, kv = p.get("journalId"), p.get("venueId")
    if kj == kv and kj != "":
        journals[kj]['count']+=1
    elif kv != "" :
        journals[kv]['count']+=1
    elif kj != "" :
        journals[kj]['count']+=1 

u.start()

print("Computing journal/venue score")
papjv, papers = u.get_papjv(papers)
PTIds, maxy = u.getPaperSet(papers)
journals = u.count_j(papers, papjv, journals)
print("Updated journal dict:")
print(journals)

print(str(len(papers))+" papers from 1995 to "+str(maxy)+" collected. Starting papers' file creation...")
pTestingJSON, citations = u.getPapersTestingJSON(papers, PTIds)
u.papersTestingForSearchFile(destination_path, pTestingJSON, citations)

### Create and write the authors' dataset
print("Papers' file created!")
print("Starting authors' file creation...")
authJSON = u.getAuthJson(papers)
la, lp, lc = len(authJSON), len(papers), len(citations)
A = u.authorsJSONObj(papers, authJSON)
## once A is ready you can write it with
u.authorsForSearchFile(auth_file, A)

print("Starting journals' file creation...")
with io.open("j_"+version+".txt", mode='w', encoding = 'utf8')  as f:
    f.write(unicode('{"journals": ['))
    i = 0
    l = len(journals)
    for j_id in journals:
        tmp = {"id":j_id, "name_list": journals[j_id]['name_list'], "count":journals[j_id]['count'], "score":journals[j_id]['score']}
        f.write(unicode(json.dumps(tmp)))
        if i < l-1:
            f.write(unicode(',  '))
        i+=1
    f.write(unicode('], "papers":'+str(lp)+', '))
    f.write(unicode('"authors":'+str(la)+', ' ))
    f.write(unicode('"maxy":'+str(maxy)+', ' ))
    f.write(unicode('"cits":'+str(lc)+'}' ))
 
print("All files created!")
u.end()
print("You can now start using your personalized instance of ReviewerNet.")
