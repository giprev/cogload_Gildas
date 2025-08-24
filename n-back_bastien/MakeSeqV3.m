function [index]=MakeSeqV3(nback,lseq) %N-back, length of the sequence. 
%allows to create a sequence of n-back with n target, where n<4. The number of targets is equal to 1/3 of length of sequence
%There are around number of targets/3 traps.



ntarget=floor(lseq/3);
crit2=0;


while crit2==0

    crit1=0;
    index=[];
    while crit1==0
        temp=ceil(rand()*12); % generates a random integer between 1 and 12
        if isempty(index)
            index=temp;
        elseif sum(index==temp)==0
            index=[index temp];
        end
        if length(index)==ntarget
            crit1=1;
        end
    end
    temp2=randperm(12);
    index=[index index index temp2(1:mod(lseq,3))];
%     crit3=0; 
%     while crit3==0
%         indextmp=[];
%         temp2=randperm(26);
%         indextmp=[index temp2(1:mod(lseq,3))];
%         if mod(lseq,3)==2
%             if (indextmp(lseq-mod(lseq,3))==indextmp(lseq-mod(lseq,3)+1)) || (indextmp(lseq-mod(lseq,3))==indextmp(lseq-mod(lseq,3)+2))
%                 crit3=0;
%             else
%                 crit3=1;
%             end
%         elseif mod(lseq,3)==1
%             if (indextmp(lseq-mod(lseq,3))==indextmp(lseq-mod(lseq,3)+1)) 
%                 crit3=0;
%             else
%                 crit3=1;
%             end
%         end
%     end
    temp=randperm(lseq);
    %index=indextmp;
    index=index(temp);

    sumback=zeros(1,3);
    for i=1:lseq
        for j=1:3
            if i>j && index(i)==index(i-j)
                sumback(j)=sumback(j)+1;
            end
        end
    end

    if sumback(nback)==ntarget && sumback(mod(nback,3)+1)==round(ntarget/3) && sumback(mod(nback+1,3)+1)==round(ntarget/3)
        crit2=1;
    end

end
