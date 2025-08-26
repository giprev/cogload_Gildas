import random
import numpy

def MakeSeqV3(nback, lseq):
    # nback: niveau N-back (1, 2 ou 3)
    # lseq: longueur de la séquence
    # Renvoie une séquence avec ntarget cibles n-back et environ ntarget/3 "pièges"

    ntarget = lseq // 3
    crit2 = False

    while not crit2:
        # Étape 1: Créer une liste de n valeurs uniques entre 1 et 12
        index = []
        while len(index) < ntarget: #Il y a ntarget différentes lettres + le complément pour arriver à lseq/3
            temp = random.randint(1, 12)
            if temp not in index:
                index.append(temp)
        # Étape 2: Ajouter deux fois les mêmes cibles pour en avoir 3 fois
        temp2 = random.sample(range(1, 13), 12)  # permutation aléatoire des 12 items
        index = index + index + index + temp2[:lseq % 3] # répétition des 12 items et remplissages avec des lettres au hasard si besoin

        # Étape 3: Mélanger la séquence
        index = [index[i] for i in random.sample(range(lseq), lseq)]

        # Étape 4: Vérifier les occurrences n-back
        sumback = [0, 0, 0]
        for i in range(lseq):
            for j in range(3):  # j = 0 (1-back), 1 (2-back), 2 (3-back)
                if i > j and index[i] == index[i - (j + 1)]:
                    sumback[j] += 1

        # Étape 5: Conditions sur les n-back
        n1 = nback - 1
        cond_main = sumback[n1] == ntarget
        cond_mod1 = sumback[(n1 + 1) % 3] == round(ntarget / 3)
        cond_mod2 = sumback[(n1 + 2) % 3] == round(ntarget / 3)

        if cond_main and cond_mod1 and cond_mod2:
            crit2 = True

    return index

print("MakeSeqV3 from Nback_jsPsych activated")
test = MakeSeqV3(2, 10)
print(test)
