import { useMemo, useState } from "react";
import "./App.css";

type Question = {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  tag: string;
};

const quizzes: Record<string, Question[]> = {
  easy: [
    {
      tag: "色彩調和",
      question: "色相環上で、ある色相の反対側に位置する色相同士の組み合わせを何という？",
      choices: ["類似色相配色", "補色色相配色", "同一色相配色", "トーン・オン・トーン"],
      answer: 1,
      explanation: "色相環で反対の位置にある色相同士は補色色相配色です。強い対比が生まれ、互いの色を引き立てます。"
    },
    {
      tag: "色の見え方",
      question: "同じ色でも、背景の色によって明るさや色みが違って見える現象に最も関係するものは？",
      choices: ["同時対比", "残像", "プルキンエ現象", "メタメリズム"],
      answer: 0,
      explanation: "同時対比は、隣接する色の影響で色の見え方が変化する現象です。明度・色相・彩度の対比があります。"
    },
    {
      tag: "トーン",
      question: "明度と彩度を複合した色の調子を表す概念は？",
      choices: ["色相", "トーン", "色温度", "演色性"],
      answer: 1,
      explanation: "トーンは明度と彩度を組み合わせた色の調子です。明るい、鈍い、濃いなど、色の印象を整理できます。"
    },
    {
      tag: "配色技法",
      question: "色相をほぼ同じにして、明度や彩度の差で変化をつける配色は？",
      choices: ["トーン・オン・トーン", "トーン・イン・トーン", "ドミナントカラー", "コンプレックスハーモニー"],
      answer: 0,
      explanation: "トーン・オン・トーンは同一または近い色相で、明度差を中心に変化をつける配色です。"
    },
    {
      tag: "色彩心理",
      question: "一般に、暖色系の色が寒色系の色より近くに見えやすい現象は？",
      choices: ["後退色", "進出色", "同化色", "無彩色化"],
      answer: 1,
      explanation: "暖色や高彩度の色は進出して見えやすく、寒色や低彩度の色は後退して見えやすい傾向があります。"
    },
    {
      tag: "色彩調和",
      question: "色相をそろえ、トーンに変化をつける配色で、まとまりを出しやすい考え方は？",
      choices: ["ドミナントカラー配色", "ドミナントトーン配色", "ビコロール", "トリコロール"],
      answer: 0,
      explanation: "ドミナントカラー配色は色相を共通性の軸にして、配色全体に統一感を持たせる方法です。"
    },
    {
      tag: "色の見え方",
      question: "暗い場所では、明るい場所に比べて青系の色が相対的に明るく感じられやすい現象は？",
      choices: ["ベゾルト・ブリュッケ現象", "プルキンエ現象", "ヘルムホルツ・コールラウシュ効果", "マッハ効果"],
      answer: 1,
      explanation: "プルキンエ現象では、暗所視に近づくにつれて短波長側の青い色が相対的に明るく、赤い色が暗く感じられます。"
    },
    {
      tag: "配色技法",
      question: "色相・トーンの共通性よりも、あえて異なる要素を組み合わせて変化をつくる配色の考え方に近いものは？",
      choices: ["アクセントカラー", "コンプレックスハーモニー", "カマイユ", "フォカマイユ"],
      answer: 1,
      explanation: "コンプレックスハーモニーは、自然界の色の見え方とは異なるような意外性や複雑さを生かす配色です。"
    }
  ],
  hard: [
    {
      tag: "表色系",
      question: "CIE L*a*b*表色系で、L*が表す属性は？",
      choices: ["色相", "明度", "彩度", "色温度"],
      answer: 1,
      explanation: "L*は明度を表します。a*は赤−緑方向、b*は黄−青方向の色みを表す知覚的に均等な空間を目指した表色系です。"
    },
    {
      tag: "色彩科学",
      question: "メタメリズム（条件等色）について、最も適切な説明は？",
      choices: [
        "異なる分光反射率の物体色が、ある照明下では同じ色に見えることがある",
        "同じ分光反射率なら照明が変わっても必ず同じ色に見える",
        "色を長時間見た後に補色の残像が見える",
        "明るさが変わると色相が必ず反転する"
      ],
      answer: 0,
      explanation: "条件等色では、分光特性が異なる色でも、特定の照明・観察条件では同じ色に見えることがあります。照明が変わると差が現れる場合があります。"
    },
    {
      tag: "色彩科学",
      question: "CIE XYZ表色系のYが、歴史的に対応づけられている量は？",
      choices: ["色相", "刺激純度", "測光量としての輝度に関係する量", "色温度"],
      answer: 2,
      explanation: "XYZ表色系のYは明るさに関係する三刺激値で、測光量の輝度と対応づけられています（規定の測定条件によります）。"
    },
    {
      tag: "色の見え方",
      question: "明るさの異なる領域の境界付近で、明暗の差が実際以上に強調されて見える現象は？",
      choices: ["マッハ効果", "同化効果", "色順応", "ベゾルト・ブリュッケ現象"],
      answer: 0,
      explanation: "マッハ効果は、明暗の境界付近で明るい側がより明るく、暗い側がより暗く感じられるような視覚的な強調です。"
    },
    {
      tag: "表色系",
      question: "マンセル表色系の三属性の正しい組み合わせは？",
      choices: ["色相・明度・彩度", "色相・輝度・色温度", "明度・純度・演色性", "色相・波長・反射率"],
      answer: 0,
      explanation: "マンセル表色系は色相（Hue）、明度（Value）、彩度（Chroma）の三属性で色を体系化します。"
    },
    {
      tag: "色彩科学",
      question: "光源の演色性を評価する代表的な従来指標として知られるものは？",
      choices: ["Ra（平均演色評価数）", "色差ΔE*ab", "相関色温度", "視感反射率"],
      answer: 0,
      explanation: "平均演色評価数Raは、基準光源と比較して試験色がどの程度同じように見えるかを評価する代表的な指標です。"
    },
    {
      tag: "色差",
      question: "CIE L*a*b*空間で、2色間の色差ΔE*abを求める基本的な考え方は？",
      choices: [
        "L*の差だけを求める",
        "a*とb*の差だけを求める",
        "L*・a*・b*各軸の差から三次元距離を求める",
        "色相角の差を百分率にする"
      ],
      answer: 2,
      explanation: "ΔE*abは、L*・a*・b*の各差を二乗して合計し、平方根を取るユークリッド距離として表します。"
    },
    {
      tag: "色彩科学",
      question: "光の加法混色で、赤・緑・青の光を同じ強さで重ねたときに理想的に得られる色は？",
      choices: ["黒", "白", "シアン", "黄"],
      answer: 1,
      explanation: "加法混色では光を重ねるほど明るくなり、RGBの三原色を適切な強さで重ねると白色光になります。"
    }
  ]
};

function App() {
  const [level, setLevel] = useState<"easy" | "hard">("easy");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => quizzes[level], [level]);
  const current = questions[index];

  const startQuiz = (nextLevel: "easy" | "hard") => {
    setLevel(nextLevel);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStarted(true);
  };

  const chooseAnswer = (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === current.answer) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    if (index + 1 === questions.length) {
      setFinished(true);
    } else {
      setIndex((value) => value + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setStarted(false);
    setFinished(false);
    setIndex(0);
    setSelected(null);
    setScore(0);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">CM</div>
        <div>
          <p className="eyebrow">COLOR KNOWLEDGE QUIZ</p>
          <h1>COLOR MASTER</h1>
        </div>
        <span className="top-note">色彩を、もっと深く。</span>
      </header>

      {!started ? (
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow">TEST YOUR COLOR SENSE</p>
            <h2>色の知識を、<br /><em>楽しみながら</em>深めよう。</h2>
            <p className="lead">色彩理論・表色系・色の見え方。知っているつもりの知識を、クイズで確かめてみませんか？</p>
          </div>
          <div className="swatch-art" aria-label="色見本">
            <span className="swatch swatch-one" />
            <span className="swatch swatch-two" />
            <span className="swatch swatch-three" />
            <span className="swatch swatch-four" />
            <span className="swatch swatch-five" />
            <span className="swatch swatch-six" />
          </div>
          <div className="level-grid">
            <button className="level-card" onClick={() => startQuiz("easy")}>
              <span className="level-kicker">LEVEL 01</span>
              <strong>少しだけ難しい</strong>
              <span className="stars">★★☆</span>
              <span className="level-desc">色彩理論・配色・色の見え方</span>
              <span className="card-cta">このレベルに挑戦 <b>→</b></span>
            </button>
            <button className="level-card dark-card" onClick={() => startQuiz("hard")}>
              <span className="level-kicker">LEVEL 02</span>
              <strong>難しい</strong>
              <span className="stars">★★★</span>
              <span className="level-desc">表色系・色彩科学・高度な知識</span>
              <span className="card-cta">このレベルに挑戦 <b>→</b></span>
            </button>
          </div>
          <p className="small-note">各レベル全8問・四択形式・解説付き</p>
        </section>
      ) : finished ? (
        <section className="result-panel">
          <p className="eyebrow">QUIZ COMPLETED</p>
          <div className="result-medal">✦</div>
          <h2>おつかれさまでした！</h2>
          <p className="result-label">{level === "easy" ? "少しだけ難しい" : "難しい"} レベルの結果</p>
          <div className="score-circle"><strong>{score}</strong><span>/ {questions.length}</span></div>
          <p className="result-message">{score === questions.length ? "全問正解！さすがの知識です。" : score >= 6 ? "素晴らしい結果です！" : "解説を読み返して、もう一度挑戦してみましょう。"}</p>
          <div className="result-actions">
            <button className="primary-button" onClick={() => startQuiz(level)}>同じレベルでもう一度</button>
            <button className="text-button" onClick={reset}>レベル選択に戻る</button>
          </div>
        </section>
      ) : (
        <section className="quiz-panel">
          <div className="quiz-heading">
            <button className="back-button" onClick={reset}>← レベル選択</button>
            <span className="quiz-level">{level === "easy" ? "LEVEL 01　少しだけ難しい" : "LEVEL 02　難しい"}</span>
          </div>
          <div className="progress-meta"><span>QUESTION {String(index + 1).padStart(2, "0")} / {questions.length}</span><span>{Math.round(((index + 1) / questions.length) * 100)}%</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="question-card">
            <span className="topic-tag">{current.tag}</span>
            <h2>{current.question}</h2>
            <div className="choice-list">
              {current.choices.map((choice, i) => {
                let stateClass = "";
                if (selected !== null && i === current.answer) stateClass = "correct";
                else if (selected === i) stateClass = "incorrect";
                return (
                  <button key={choice} className={`choice ${stateClass}`} onClick={() => chooseAnswer(i)} disabled={selected !== null}>
                    <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{choice}</span>
                    {selected !== null && i === current.answer && <span className="choice-mark">✓</span>}
                    {selected === i && i !== current.answer && <span className="choice-mark">×</span>}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <div className={`explanation ${selected === current.answer ? "is-correct" : "is-wrong"}`}>
                <strong>{selected === current.answer ? "正解！" : "惜しい！正解は「" + current.choices[current.answer] + "」"}</strong>
                <p>{current.explanation}</p>
              </div>
            )}
          </div>
          <div className="quiz-footer">
            <span className="score-live">現在の正解数 <b>{score}</b></span>
            <button className="primary-button" onClick={nextQuestion} disabled={selected === null}>{index + 1 === questions.length ? "結果を見る" : "次の問題へ"}　→</button>
          </div>
        </section>
      )}
      <footer className="footer">COLOR MASTER <span>LEARN · PLAY · DISCOVER</span></footer>
    </main>
  );
}

export default App;
