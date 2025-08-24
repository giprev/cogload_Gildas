import random

def SequenceOfLetterTB(lseq):
    if lseq % 2 != 0:
        raise ValueError("Length of sequence has to be divisible by 2")
    else:
        index_letter_tmp = [1] * (lseq // 2) + [2] * (lseq // 2)
        random.shuffle(index_letter_tmp)
        return index_letter_tmp

# test = SequenceOfLetterTB(10)
# print(test)
