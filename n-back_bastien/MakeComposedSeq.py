import random
from MakeSeqV3 import MakeSeqV3
from SequenceOfLetterTB import SequenceOfLetterTB

def MakeComposedSeq(nback, firstsec, secondsec):
    total = firstsec + secondsec

    
    # I delete this sequence because we do want sometimes to have target at the beginning of the sequence
    # crit = False
    # while not crit:
    index = MakeSeqV3(nback, firstsec) + MakeSeqV3(nback, secondsec) #['I', 'C', 'a', 'o', 'o', 'c', 'o', 'C', 'A', 'i', 'A', 'I']+ MakeSeqV3(nback, secondsec)
        
    #     crit = True  # assume it's valid unless proven otherwise
    #     for a in range(3):
    #         i = a + firstsec
    #         if index[i] == index[i + 1] or index[i] == index[i + 2] or index[i] == index[i + 3]:
    #             crit = False
    #             break

    index_letter = SequenceOfLetterTB(total) # gives a sequence of 0 and 1 of the same size as the sequence of numbers (lseq) so that letters are randomly either upper-case or lower-case
    
    letters  = ['A', 'E', 'I', 'O', 'U', 'Y', 'B', 'C', 'G', 'K', 'M', 'P']
    
    l_letters = []
    for i in range(len(index_letter)):
        l_letters.append(letters[index[i] - 1])

    # I also comment out this part, to have only uppercase letters
    # letters2 = ['a', 'e', 'i', 'o', 'u', 'y', 'b', 'c', 'g', 'k', 'm', 'p']
    # l_letters = []
    # for i in range(total):
    #     if index_letter[i] == 1:
    #         l_letters.append(letters[index[i] - 1])   # MATLAB is 1-based; Python is 0-based
    #     else:
    #         l_letters.append(letters2[index[i] - 1])
    
    return l_letters #, index

result = MakeComposedSeq(2, 10, 10)
print(result)

# b = [6, 6, 9, 2, 1, 11, 1, 11, 1, 2, 11, 2, 6, 3, 1, 2, 11, 9, 9, 3, 9, 3, 1, 11, 1, 11]
# print(len(b))