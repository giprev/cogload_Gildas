function [lLetters,index]= MakeComposedSeq(nback,firstsec,secondsec)
crit=0;
tot=firstsec+secondsec;
while crit==0
    index=[MakeSeqV3(nback,firstsec) MakeSeqV3(nback,secondsec)];
    for a=1:3
        if index(a+firstsec)==index(a+firstsec+3) || index(a+firstsec)==index(a+firstsec+2) ||index(a+firstsec)==index(a+firstsec+1)
            crit=0;
        else
            crit=1;
        end
    end
end
indexletter=SequenceOfLetterTB(tot); 
letters=['A' ,'E' ,'I' ,'O' ,'U' ,'Y' ,'B' ,'C' ,'G' ,'K' ,'M' ,'P'];
letters2=['a', 'e', 'i', 'o', 'u', 'y', 'b', 'c', 'g', 'k', 'm', 'p'];

for itrial=1:tot
    if indexletter(itrial)==1
        lLetters{itrial} = letters(index(itrial));
    else
        lLetters{itrial} = letters2(index(itrial));
    end
end