import random

def generate_nback_string(nback, block_triples=False):
    lseq = 20
    ntarget = 7
    nplus1 = 5
    # nminus1 = 0
    # letters = ['st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7', 'st8']
    letters = ['A', 'E', 'I', 'O', 'U', 'Y', 'B', 'C', 'G', 'K', 'M', 'P']

    while True:
        seq = [random.choice(letters) for _ in range(lseq)]

        # Place n-back targets
        positions = random.sample(range(nback, lseq), ntarget)
        for pos in positions:
            seq[pos] = seq[pos - nback]

        # Place N+1-back targets (avoid overlap with n-back targets)
        available_plus1 = [i for i in range(nback+1, lseq) if i not in positions and (i-nback-1) >= 0]
        if len(available_plus1) < nplus1:
            continue
        plus1_positions = random.sample(available_plus1, nplus1)
        for pos in plus1_positions:
            seq[pos] = seq[pos - (nback + 1)]

        # Place N-1-back targets (avoid overlap with n-back and N+1-back targets)
        # available_minus1 = [i for i in range(nback-1, lseq) if i not in positions and i not in plus1_positions and (i-nback+1) >= 0]
        # if len(available_minus1) < nminus1:
        #     continue
        # minus1_positions = random.sample(available_minus1, nminus1)
        # for pos in minus1_positions:
        #     seq[pos] = seq[pos - (nback - 1)]

        # Analyze the sequence to check if the counts are exact
        nback_count = sum(seq[i] == seq[i-nback] for i in range(nback, lseq))
        nplus1_count = sum(seq[i] == seq[i-(nback+1)] for i in range(nback+1, lseq))
        # nminus1_count = sum(seq[i] == seq[i-(nback-1)] for i in range(nback-1, lseq))

        # Block three consecutive identical letters if requested
        if block_triples:
            has_triple = any(seq[i] == seq[i-1] == seq[i-2] for i in range(2, lseq))
            if has_triple:
                continue

        if nback_count == ntarget and nplus1_count == nplus1: # and nminus1_count == nminus1:
            return seq

def analyze_nback(seq, nback):
    nback_positions = []
    nplus1_positions = []
    nminus1_positions = []

    # n-back
    for i in range(nback, len(seq)):
        if seq[i] == seq[i-nback]:
            nback_positions.append(i)
    # N+1-back
    for i in range(nback+1, len(seq)):
        if seq[i] == seq[i-(nback+1)]:
            nplus1_positions.append(i)
    # N-1-back (only if nback > 1)
    if nback > 1:
        for i in range(nback-1, len(seq)):
            if seq[i] == seq[i-(nback-1)]:
                nminus1_positions.append(i)

    print(f"Sequence: {''.join(seq)}")
    print(f"\n{nback}-back targets: {len(nback_positions)} at positions {nback_positions}")
    print(f"{nback+1}-back matches: {len(nplus1_positions)} at positions {nplus1_positions}")
    if nback > 1:
        print(f"{nback-1}-back matches: {len(nminus1_positions)} at positions {nminus1_positions}")

    return nback_positions, nplus1_positions, nminus1_positions

ex = generate_nback_string(1, block_triples=True)

print(ex)
print(analyze_nback(ex, 1))  # Changed from 2 to 1


