import random

lseq = 15
ntarget = 5
nplus1 = 2
nminus1 = 2

def generate_nback_string(nback, has_fourples):
    letters = ['st0', 'st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7', 'st8']
    # letters = ['A', 'E', 'I', 'O', 'U', 'Y', 'B', 'C', 'G', 'K', 'M', 'P']

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
        available_minus1 = [i for i in range(nback-1, lseq) if i not in positions and i not in plus1_positions and (i-nback+1) >= 0]
        if len(available_minus1) < nminus1:
            continue
        minus1_positions = random.sample(available_minus1, nminus1)
        for pos in minus1_positions:
            seq[pos] = seq[pos - (nback - 1)]

        # Analyze the sequence to check if the counts are exact
        nback_count = sum(seq[i] == seq[i-nback] for i in range(nback, lseq))
        nplus1_count = sum(seq[i] == seq[i-(nback+1)] for i in range(nback+1, lseq))
        nminus1_count = sum(seq[i] == seq[i-(nback-1)] for i in range(nback-1, lseq))

         # Check for four consecutive identical letters
        has_four_consecutive = any(seq[i] == seq[i-1] == seq[i-2] == seq[i-3] for i in range(3, lseq))
        
        # If we don't want fourples and we found them, skip this sequence
        if not has_fourples and has_four_consecutive:
            continue
        
        # Check for three consecutive identical letters and count them
        three_consecutive_count = 0
        for i in range(2, lseq):
            if seq[i] == seq[i-1] == seq[i-2]:
                three_consecutive_count += 1

        # Allow maximum 1 occurrence of three consecutive letters
        if three_consecutive_count > 1:
            continue

        if nback_count == ntarget and nplus1_count == nplus1 and nminus1_count == nminus1:
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

# ex = generate_nback_string(1)
# print(ex)
# analyze_nback(ex, 1)

def make41():
    """
    Generate 41 sequences using generate_nback_string function.
    Returns an array of 41 sequence objects.
    """
    sequences = []

    for i in range(41):
        sequence = generate_nback_string(2, has_fourples=False) 
        sequence_array = [f'{letter}' for letter in sequence]
        sequences.append(sequence_array)
    
    return sequences

# example = make41()
# print(example)
# analyze_nback(example[0], 2)

# Usage example:
# all_sequences = make41()
# print(all_sequences)

# print(analyze_nback(['E', 'B', 'E', 'B', 'B', 'A', 'A', 'B', 'A', 'A', 'B', 'A', 'P', 'A', 'B', 'I', 'A', 'E', 'B', 'P'], 2))

# print(len(['Y', 'O', 'Y', 'O', 'Y', 'O', 'C', 'G', 'C', 'K', 'G', 'C', 'E', 'E', 'E', 'U', 'A', 'O', 'E', 'O', 'Y', 'O', 'I', 'Y', 'I', 'P', 'P', 'M', 'Y', 'M', 'M', 'P', 'K', 'P', 'K', 'K', 'P', 'P', 'P', 'K', 'O', 'U', 'K', 'U', 'G', 'U', 'M', 'K', 'M', 'B', 'M', 'U', 'M', 'M', 'B', 'M', 'B', 'B', 'E', 'I', 'O', 'G', 'G']))

# print(analyze_nback(['O', 'Y', 'M', 'O', 'O', 'M', 'M', 'C', 'M', 'A', 'C', 'M', 'M', 'C', 'I', 'M', 'M', 'A', 'I', 'M', 'Y', 'I', 'E', 'K', 'A', 'I', 'E', 'C', 'C', 'A', 'E', 'O', 'C', 'A', 'M', 'Y', 'Y', 'A', 'E', 'Y', 'C', 'E', 'I', 'C', 'A', 'I', 'P', 'A', 'A', 'I', 'I', 'A', 'C', 'I', 'I', 'C', 'E', 'Y', 'K', 'E', 'E', 'K', 'E'], 1))

# print(analyze_nback(,1))
print(analyze_nback(['M', 'A', 'M', 'C', 'C', 'G', 'U', 'U', 'G', 'A', 'G', 'K', 'K', 'K', 'U', 'G', 'O', 'O', 'P', 'O', 'G', 'G', 'G', 'M', 'P', 'P', 'P', 'P', 'P', 'E', 'P', 'E', 'G', 'E', 'G', 'E', 'P', 'G', 'G', 'G', 'U', 'P', 'U', 'K', 'K', 'A', 'A', 'A', 'M', 'M', 'M', 'I', 'I', 'I', 'O', 'G', 'O', 'E', 'O', 'M', 'E', 'K', 'Y'], 2))



# ex = generate_nback_string(1)
# print(ex)
# print(analyze_nback(ex, 1))


















# import random



# def generate_nback_string(nback, block_triples=False):
#     lseq = 63
#     ntarget = 21
#     nplus1 = 10
#     nminus1 = 10 if nback > 1 else 0
#     letters = ['A', 'E', 'I', 'O', 'U', 'Y', 'B', 'C', 'G', 'K', 'M', 'P']
    
#     max_attempts = 100000
    
#     for attempt in range(max_attempts):
#         # Start with random sequence
#         seq = [random.choice(letters) for _ in range(lseq)]
        
#         # Choose positions for each type of match
#         nback_positions = random.sample(range(nback, lseq), ntarget)
        
#         # Ensure n+1 positions don't overlap with n-back
#         available_nplus1 = [i for i in range(nback+1, lseq) if i not in nback_positions]
#         if len(available_nplus1) < nplus1:
#             continue
#         nplus1_positions = random.sample(available_nplus1, nplus1)
        
#         # Ensure n-1 positions don't overlap (only for nback > 1)
#         nminus1_positions = []
#         if nback > 1:
#             available_nminus1 = [i for i in range(nback-1, lseq) 
#                                 if i not in nback_positions and i not in nplus1_positions]
#             if len(available_nminus1) < nminus1:
#                 continue
#             nminus1_positions = random.sample(available_nminus1, nminus1)
        
#         # Now place the matches
#         for pos in nback_positions:
#             seq[pos] = seq[pos - nback]
        
#         for pos in nplus1_positions:
#             seq[pos] = seq[pos - (nback + 1)]
            
#         for pos in nminus1_positions:
#             seq[pos] = seq[pos - (nback - 1)]
        
#         # Check for unwanted matches and fix them
#         success = True
#         max_fixes = 50
        
#         for fix_attempt in range(max_fixes):
#             # Count all matches
#             actual_nback = [i for i in range(nback, lseq) if seq[i] == seq[i-nback]]
#             actual_nplus1 = [i for i in range(nback+1, lseq) if seq[i] == seq[i-(nback+1)]]
#             actual_nminus1 = []
#             if nback > 1:
#                 actual_nminus1 = [i for i in range(nback-1, lseq) if seq[i] == seq[i-(nback-1)]]
            
#             # Find unwanted matches
#             unwanted_nback = [i for i in actual_nback if i not in nback_positions]
#             unwanted_nplus1 = [i for i in actual_nplus1 if i not in nplus1_positions]
#             unwanted_nminus1 = [i for i in actual_nminus1 if i not in nminus1_positions]
            
#             if not unwanted_nback and not unwanted_nplus1 and not unwanted_nminus1:
#                 break
                
#             # Fix unwanted matches by changing letters at safe positions
#             all_target_positions = set(nback_positions + nplus1_positions + nminus1_positions)
            
#             for pos in unwanted_nback + unwanted_nplus1 + unwanted_nminus1:
#                 if pos not in all_target_positions:
#                     # Find a letter that doesn't create matches
#                     for new_letter in letters:
#                         seq[pos] = new_letter
#                         # Check if this fixes the unwanted match
#                         if pos in unwanted_nback and seq[pos] != seq[pos - nback]:
#                             break
#                         elif pos in unwanted_nplus1 and seq[pos] != seq[pos - (nback + 1)]:
#                             break
#                         elif pos in unwanted_nminus1 and seq[pos] != seq[pos - (nback - 1)]:
#                             break
#                     break  # Fix one at a time
#         else:
#             success = False
        
#         if not success:
#             continue
            
#         # Final validation
#         final_nback = sum(1 for i in range(nback, lseq) if seq[i] == seq[i-nback])
#         final_nplus1 = sum(1 for i in range(nback+1, lseq) if seq[i] == seq[i-(nback+1)])
#         final_nminus1 = 0
#         if nback > 1:
#             final_nminus1 = sum(1 for i in range(nback-1, lseq) if seq[i] == seq[i-(nback-1)])
        
#         if final_nback != ntarget or final_nplus1 != nplus1:
#             continue
#         if nback > 1 and final_nminus1 != nminus1:
#             continue
            
#         # Check for triples if requested
#         if block_triples:
#             has_triple = any(seq[i] == seq[i-1] == seq[i-2] for i in range(2, lseq))
#             if has_triple:
#                 continue
        
#         return seq
    
#     raise RuntimeError(f"Could not generate valid sequence after {max_attempts} attempts")

# def analyze_nback(seq, nback):
#     nback_positions = []
#     nplus1_positions = []
#     nminus1_positions = []

#     # n-back
#     for i in range(nback, len(seq)):
#         if seq[i] == seq[i-nback]:
#             nback_positions.append(i)
    
#     # N+1-back
#     for i in range(nback+1, len(seq)):
#         if seq[i] == seq[i-(nback+1)]:
#             nplus1_positions.append(i)
    
#     # N-1-back (only if nback > 1)
#     if nback > 1:
#         for i in range(nback-1, len(seq)):
#             if seq[i] == seq[i-(nback-1)]:
#                 nminus1_positions.append(i)

#     print(f"Sequence: {''.join(seq)}")
#     print(f"\n{nback}-back targets: {len(nback_positions)} at positions {nback_positions}")
#     print(f"{nback+1}-back matches: {len(nplus1_positions)} at positions {nplus1_positions}")
#     if nback > 1:
#         print(f"{nback-1}-back matches: {len(nminus1_positions)} at positions {nminus1_positions}")
    
#     # Check for consecutive triples
#     triples = []
#     for i in range(2, len(seq)):
#         if seq[i] == seq[i-1] == seq[i-2]:
#             triples.append((i-2, seq[i]))
    
#     if triples:
#         print(f"Triple consecutive letters found at positions: {triples}")
#     else:
#         print("No triple consecutive letters found")

#     return nback_positions, nplus1_positions, nminus1_positions

# # Test the function
# ex = generate_nback_string(2, block_triples=False)
# analyze_nback(ex, 2)



# # # Test with different n-back values
# # for n in [1, 2, 3]:
# #     print(f"\n=== Testing {n}-back ===")
# #     try:
# #         ex = generate_nback_string(n, block_triples=True)
# #         print(f"Generated: {''.join(ex)}")
# #         analyze_nback(ex, n)
# #     except RuntimeError as e:
# #         print(f"Failed to generate {n}-back sequence: {e}")
# # ex = generate_nback_string(2, block_triples=False)
# # analyze_nback(ex, 2)



# import random

# def generate_nback_sequence():
#     letters = ['A', 'E', 'I', 'O', 'U', 'Y', 'B', 'C', 'G', 'K', 'M', 'P']
#     length = 63
    
#     # Required counts
#     target_counts = {"1back": 10, "2back": 21, "3back": 10}
    
#     # Randomly assign positions for targets
#     available_positions = list(range(3, length))
#     random.shuffle(available_positions)
    
#     positions = {"1back": set(), "2back": set(), "3back": set()}
#     for kind, count in target_counts.items():
#         for _ in range(count):
#             positions[kind].add(available_positions.pop())
    
#     sequence = []
    
#     for i in range(length):
#         candidate = None
        
#         # Forced targets
#         if i in positions["1back"]:
#             candidate = sequence[i-1]
#         elif i in positions["2back"]:
#             candidate = sequence[i-2]
#         elif i in positions["3back"]:
#             candidate = sequence[i-3]
#         else:
#             # Non-target filler
#             while True:
#                 candidate = random.choice(letters)
#                 # Avoid accidental extra 1/2/3-back
#                 if i >= 1 and candidate == sequence[i-1]:
#                     continue
#                 if i >= 2 and candidate == sequence[i-2]:
#                     continue
#                 if i >= 3 and candidate == sequence[i-3]:
#                     continue
#                 break
        
#         # Rule: absolutely no 4-in-a-row
#         if i >= 3 and sequence[i-1] == sequence[i-2] == sequence[i-3] == candidate:
#             # If this is a target, we must adjust earlier filler (backtrack)
#             if i in positions["1back"] or i in positions["2back"] or i in positions["3back"]:
#                 # Change the previous non-target letter
#                 for back in [1, 2, 3]:
#                     if (i - back) not in positions["1back"] and (i - back) not in positions["2back"] and (i - back) not in positions["3back"]:
#                         # Replace that letter with something different
#                         alternatives = [l for l in letters if l != sequence[i - back]]
#                         sequence[i - back] = random.choice(alternatives)
#                         break
#             else:
#                 # For non-targets, just pick a different letter
#                 alternatives = [l for l in letters if l != candidate]
#                 candidate = random.choice(alternatives)
        
#         sequence.append(candidate)
    
#     return "".join(sequence), positions

# # Example run
# seq, pos = generate_nback_sequence()
# print("Generated sequence:", seq)
# print("1-backs:", len(pos["1back"]))
# print("2-backs:", len(pos["2back"]))
# print("3-backs:", len(pos["3back"]))


# print("analyze_nback function:")
# st0 = 'st0'
# st1 = 'st1'
# st2 = 'st2'
# st3 = 'st3'
# st4 = 'st4'
# st5 = 'st5'
# st6 = 'st6'
# st7 = 'st7'
# st8 = 'st8'
# st9 = 'st9'
# seq = ['G', 'O', 'G', 'P', 'P', 'G', 'M', 'C', 'C', 'B', 'A', 'M', 'B', 'M', 'B', 'M', 'M', 'C', 'M', 'B', 'C', 'B', 'O', 'O', 'A', 'U', 'A', 'U', 'A', 'I', 'A', 'I', 'A', 'A', 'G', 'G', 'O', 'A', 'O', 'U', 'C', 'U', 'C', 'C', 'P', 'Y', 'C', 'Y', 'O', 'E', 'Y', 'E', 'P', 'O', 'M', 'O', 'K', 'O', 'O', 'U', 'U', 'U', 'G']
# print(analyze_nback(seq, 2))