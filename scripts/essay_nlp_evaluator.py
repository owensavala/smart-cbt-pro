#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart CBT - Free Local Python NLP Auto-Grading Engine for Essays
Evaluator Esai Otomatis Berbasis NLP Tanpa Kuota / API Berbayar (100% Offline & Gratis)
"""

import sys
import json
import re
import math
from collections import Counter
from typing import List, Dict, Any, Tuple

# Kamus Sinonim Bahasa Indonesia Khusus Sains & Humaniora
INDONESIAN_SYNONYMS = {
    "oksigen": ["o2", "gas oksigen", "zat oksigen"],
    "karbon dioksida": ["co2", "karbondioksida", "zat asam arang", "gas co2"],
    "cahaya": ["sinar", "radiasi", "pancaran", "foton"],
    "matahari": ["surya", "mentari"],
    "glukosa": ["karbohidrat", "gula", "energi kimia", "zat makanan", "amilum", "pati", "c6h12o6"],
    "klorofil": ["zat hijau daun", "pigmen hijau", "kloroplas"],
    "tumbuhan": ["tanaman", "flora", "vegetasi"],
    "air": ["h2o"],
    "menghasilkan": ["memproduksi", "menciptakan", "membentuk", "melepaskan", "mengeluarkan", "sintesis"],
    "proses": ["tahapan", "mekanisme", "cara kerja", "reaksi"],
    "alveolus": ["gelembung paru paru", "kantong udara", "alveoli"],
    "pernapasan": ["respirasi", "bernapas"],
    "pertukaran": ["pergantian", "difusi", "sirkulasi"],
    "darah": ["pembuluh darah", "sel darah merah", "eritrosit", "hemoglobin"],
    "penyebab": ["faktor", "pemicu", "alasan", "latar belakang"],
    "perang": ["pertempuran", "perlawanan", "konflik", "agresi"],
    "belanda": ["kolonial", "penjajah", "voc", "pemerintah hindia belanda"],
    "pajak": ["upeti", "pungutan", "tribute"],
    "makam": ["kuburan", "tanah leluhur", "pesarean", "pusara"],
    "patok": ["tonggak", "tanda batas", "pancang"],
}

# Daftar Kata Negasi (Pendeteksi Pembalikan Makna)
NEGATION_WORDS = {
    "tidak", "bukan", "tanpa", "belum", "jangan", "kurang", "tiada", "tak", "bukanlah", "ndak", "nggak"
}

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def tokenize(text: str) -> List[str]:
    norm = normalize_text(text)
    return [t for t in norm.split() if t]

def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def is_fuzzy_match(word: str, target: str) -> Tuple[bool, int]:
    w, t = word.lower(), target.lower()
    if w == t:
        return True, 0
    max_len = max(len(w), len(t))
    if max_len < 4:
        return False, 99
    dist = levenshtein_distance(w, t)
    if max_len <= 6 and dist <= 1:
        return True, dist
    if max_len >= 7 and dist <= 2:
        return True, dist
    return False, dist

def compute_cosine_similarity(text1: str, text2: str) -> float:
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)
    if not tokens1 or not tokens2:
        return 0.0

    vec1 = Counter(tokens1)
    vec2 = Counter(tokens2)

    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum(vec1[x] * vec2[x] for x in intersection)

    sum1 = sum(v ** 2 for v in vec1.values())
    sum2 = sum(v ** 2 for v in vec2.values())
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    return float(numerator) / denominator

def check_keyword_in_tokens(tokens: List[str], keyword: str, synonyms: List[str] = None) -> Dict[str, Any]:
    norm_kw = normalize_text(keyword)
    candidates = [norm_kw]

    if norm_kw in INDONESIAN_SYNONYMS:
        candidates.extend([normalize_text(s) for s in INDONESIAN_SYNONYMS[norm_kw]])
    if synonyms:
        candidates.extend([normalize_text(s) for s in synonyms])

    for cand in candidates:
        cand_tokens = tokenize(cand)
        c_len = len(cand_tokens)

        for i in range(len(tokens) - c_len + 1):
            match_count = 0
            for j in range(c_len):
                is_match, _ = is_fuzzy_match(tokens[i + j], cand_tokens[j])
                if is_match:
                    match_count += 1

            if match_count == c_len:
                # Periksa apakah ada kata negasi di 1-3 kata sebelumnya
                is_negated = False
                neg_term = None
                start_check = max(0, i - 3)
                for k in range(start_check, i):
                    if tokens[k] in NEGATION_WORDS:
                        is_negated = True
                        neg_term = tokens[k]
                        break

                return {
                    "found": True,
                    "matchedTerm": cand,
                    "isNegated": is_negated,
                    "negationTerm": neg_term,
                }

    return {"found": False, "matchedTerm": "", "isNegated": False}

def evaluate_essay_nlp(data: Dict[str, Any]) -> Dict[str, Any]:
    student_answer = data.get("studentAnswer", "").strip()
    rubric = data.get("rubric", {})
    ideal_answer = rubric.get("idealAnswer", "").strip()
    max_score = float(rubric.get("maxScore", 10.0))
    key_points = rubric.get("keyPoints", [])
    strictness = rubric.get("strictness", "standard")

    if not student_answer:
        return {
            "success": True,
            "engine": "Python NLP Local Evaluator (Free / Offline)",
            "finalScore": 0.0,
            "maxScore": max_score,
            "percentage": 0.0,
            "cosineSimilarity": 0.0,
            "matchedKeywords": [],
            "missingKeywords": [],
            "pedagogicalFeedback": "Jawaban siswa kosong atau belum diisi. Skor 0.",
            "breakdown": []
        }

    student_tokens = tokenize(student_answer)
    matched_kws = []
    missing_kws = []
    breakdown = []
    total_rubric_earned = 0.0
    total_rubric_weight = 0.0

    # 1. Evaluasi Setiap KeyPoint / Rubrik
    if key_points:
        for kp in key_points:
            concept = kp.get("concept", "Konsep")
            weight = float(kp.get("weight", max_score / max(len(key_points), 1)))
            mand_kws = kp.get("mandatoryKeywords", [])
            total_rubric_weight += weight

            kp_matched = []
            kp_negated = []

            for kw in mand_kws:
                res = check_keyword_in_tokens(student_tokens, kw)
                if res["found"]:
                    if res["isNegated"]:
                        kp_negated.append(kw)
                    else:
                        kp_matched.append(kw)
                        matched_kws.append(kw)
                else:
                    missing_kws.append(kw)

            # Hitung skor per keypoint
            coverage = len(kp_matched) / max(len(mand_kws), 1)
            if kp_negated:
                coverage = max(0.0, coverage - 0.5 * len(kp_negated))

            earned = weight * coverage
            total_rubric_earned += earned

            breakdown.append({
                "concept": concept,
                "weight": weight,
                "earned": round(earned, 2),
                "matchedKeywords": kp_matched,
                "negatedKeywords": kp_negated,
                "status": "Lengkap" if coverage >= 0.8 else ("Sebagian" if coverage > 0 else "Belum Disebut")
            })
    else:
        # Fallback jika rubric tidak menyertakan keyPoints: gunakan kata kunci ideal answer
        ideal_tokens = set(tokenize(ideal_answer))
        matched = set(student_tokens) & ideal_tokens
        coverage = len(matched) / max(len(ideal_tokens), 1)
        total_rubric_weight = max_score
        total_rubric_earned = max_score * min(1.0, coverage * 1.5)

    # 2. Vektor Cosine Similarity
    cosine_sim = compute_cosine_similarity(student_answer, ideal_answer) if ideal_answer else 0.5

    # 3. Bobot Skor Komposit (70% Rubrik Kata Kunci + 30% Kemiripan Vektor)
    rubric_ratio = (total_rubric_earned / total_rubric_weight) if total_rubric_weight > 0 else 0.0

    if strictness == "lenient":
        composite_ratio = 0.60 * rubric_ratio + 0.40 * cosine_sim
    elif strictness == "strict":
        composite_ratio = 0.85 * rubric_ratio + 0.15 * cosine_sim
    else: # standard
        composite_ratio = 0.70 * rubric_ratio + 0.30 * cosine_sim

    final_score = min(max_score, max(0.0, round(max_score * composite_ratio, 1)))
    percentage = round((final_score / max_score) * 100, 1)

    # 4. Umpan Balik Pedagogis (Feedback Edukatif)
    if percentage >= 85:
        feedback = f"Sangat Baik! Jawaban komprehensif dan tepat sasaran. Konsep utama berhasil dijelaskan dengan sangat baik (skor: {final_score}/{max_score})."
    elif percentage >= 70:
        feedback = f"Bagus! Konsep dasar sudah dipahami dengan baik. Anda dapat melengkapi pembahasan mengenai: {', '.join(missing_kws[:3]) if missing_kws else 'penjelasan lebih mendalam'}."
    elif percentage >= 50:
        feedback = f"Cukup. Sebagian konsep telah disebutkan, namun masih membutuhkan penjabaran mengenai: {', '.join(missing_kws[:4])}."
    else:
        feedback = f"Perlu Peningkatan. Jawaban belum memuat poin-poin esensial pertanyaan. Kata kunci penting yang belum ada: {', '.join(missing_kws[:5])}."

    return {
        "success": True,
        "engine": "Python 3.12 NLP Local Evaluator (Free / Zero-Cost)",
        "finalScore": final_score,
        "maxScore": max_score,
        "percentage": percentage,
        "cosineSimilarity": round(cosine_sim, 3),
        "matchedKeywords": list(set(matched_kws)),
        "missingKeywords": list(set(missing_kws)),
        "pedagogicalFeedback": feedback,
        "breakdown": breakdown
    }

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        data = {
            "studentAnswer": "Fotosintesis adalah proses tumbuhan membuat makanan dengan bantuan sinar matahari, klorofil dan menghasilkan gas oksigen.",
            "rubric": {
                "idealAnswer": "Fotosintesis adalah proses biokimia pembentukan karbohidrat atau glukosa oleh tumbuhan menggunakan klorofil, air, dan karbon dioksida dengan bantuan energi cahaya matahari serta melepaskan oksigen.",
                "maxScore": 20,
                "keyPoints": [
                    {"concept": "Klorofil & Cahaya", "weight": 7, "mandatoryKeywords": ["klorofil", "matahari"]},
                    {"concept": "Bahan & Hasil", "weight": 13, "mandatoryKeywords": ["karbon dioksida", "oksigen", "glukosa"]}
                ]
            }
        }
    elif len(sys.argv) > 1 and sys.argv[1] != "-":
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
    elif not sys.stdin.isatty():
        input_data = sys.stdin.read()
        data = json.loads(input_data)
    else:
        data = {
            "studentAnswer": "Fotosintesis adalah proses tumbuhan membuat makanan dengan bantuan sinar matahari, klorofil dan menghasilkan gas oksigen.",
            "rubric": {
                "idealAnswer": "Fotosintesis adalah proses biokimia pembentukan karbohidrat atau glukosa oleh tumbuhan menggunakan klorofil, air, dan karbon dioksida dengan bantuan energi cahaya matahari serta melepaskan oksigen.",
                "maxScore": 20,
                "keyPoints": [
                    {"concept": "Klorofil & Cahaya", "weight": 7, "mandatoryKeywords": ["klorofil", "matahari"]},
                    {"concept": "Bahan & Hasil", "weight": 13, "mandatoryKeywords": ["karbon dioksida", "oksigen", "glukosa"]}
                ]
            }
        }

    result = evaluate_essay_nlp(data)
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
