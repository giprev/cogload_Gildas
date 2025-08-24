function [finalindexletter]=SequenceOfLetterTB(lseq)

if mod(lseq,2)~=0
    error('length of sequence has to be divisible per 2');
else
    indexlettertmp=[ones(1,lseq/2) ones(1,lseq/2)+1];
    finalindexletter=indexlettertmp(randperm(lseq));
end