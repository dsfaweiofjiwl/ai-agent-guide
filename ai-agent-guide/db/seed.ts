import { getDb } from "../lib/db";

const db = getDb();

// Clean existing data
db.exec("DELETE FROM comments");
db.exec("DELETE FROM articles");
db.exec("DELETE FROM chapters");

// Seed chapters
const ch1 = db
  .prepare(`INSERT INTO chapters (slug, title, "order") VALUES (?, ?, ?)`)
  .run("basics", "基础篇", 1);
const ch2 = db
  .prepare(`INSERT INTO chapters (slug, title, "order") VALUES (?, ?, ?)`)
  .run("tools", "工具篇", 2);
const ch3 = db
  .prepare(`INSERT INTO chapters (slug, title, "order") VALUES (?, ?, ?)`)
  .run("engineering", "工程篇", 3);
const ch4 = db
  .prepare(`INSERT INTO chapters (slug, title, "order") VALUES (?, ?, ?)`)
  .run("practice", "实战篇", 4);

const ch1Id = Number(ch1.lastInsertRowid);
const ch2Id = Number(ch2.lastInsertRowid);
const ch3Id = Number(ch3.lastInsertRowid);
const ch4Id = Number(ch4.lastInsertRowid);

// Seed articles
const insertArticle = db.prepare(
  `INSERT INTO articles (slug, title, chapter_id, "order", content) VALUES (?, ?, ?, ?, ?)`
);

// ========== 基础篇 ==========
insertArticle.run(
  "what-is-ai-agent",
  "什么是 AI Agent",
  ch1Id,
  1,
  `## 什么是 AI Agent？

想象一下：早上到公司，你对电脑说了一句话——

> "帮我调研一下上周市场上新出的 AI 编程工具，整理成一份竞品报告，发给团队。"

然后你去做别的事了。半小时后，你的邮箱里多了一封草稿邮件，附件是一份 8 页的 PDF 报告——里面有市场概览、产品对比表、各家融资情况，甚至附上了信息来源的链接。

这不是科幻。这是 AI Agent 今天已经能做的事情。

---

### 聊天机器人 vs AI Agent：从"对话"到"交付"

你用过 ChatGPT 或者 Claude 对吧？你问一个问题，它给你一个答案。很好用，但这本质上只是**对话**。

AI Agent 往前走了一大步：它不只是回答，它去**做事**。

| 对比维度 | 聊天机器人 | AI Agent |
|---|---|---|
| 交互方式 | 你问一句，它答一句 | 你给目标，它自己去执行 |
| 能力边界 | 只能生成文本 | 搜索网页、读写文件、调用 API、执行代码 |
| 任务复杂度 | 单步问答 | 多步规划 + 执行 + 验证 |
| 自主性 | 完全被动 | 主动拆解任务、选工具、纠错 |
| 交付什么 | 一段回复 | 一个**结果** |

一句话概括：**聊天机器人陪你聊，AI Agent 帮你干。**

---

### Agent 是怎样工作的？

Agent 的核心逻辑其实并不复杂，就像一个聪明能干的助手：

**第一步：理解意图。** 你给的不是"指令"，而是"目标"。Agent 首先搞清楚你到底想要什么结果。

**第二步：制定计划。** 你的目标可能很大——"写一份竞品报告"，Agent 会把它拆成几个子任务：搜索竞品信息 → 收集融资数据 → 整理对比表格 → 写报告 → 排版 → 发送。

**第三步：调用工具。** 这是 Agent 区别于聊天机器人的关键一步。它不会坐在那里凭空编造——它会去搜索引擎查资料、去数据库拉数据、用代码处理表格。**LLM 是它的大脑，工具是它的双手。**

**第四步：观察结果，自我纠错。** 搜到的信息不够？代码跑报错了？Agent 会判断问题在哪，换一种方式再试。这个"尝试→观察→调整→再尝试"的循环，是 Agent 智能的核心体现。

**第五步：交付结果。** 所有子任务完成后，Agent 把结果整理好交给你——一份报告、一封邮件、一个部署好的网页，等等。

\`\`\`
你给一个目标 →
  Agent 拆解为多个步骤 →
    每一步：选择工具 → 执行 → 检查结果 →
      出错了？换方案重试 →
        所有步骤完成 →
          交付最终结果
\`\`\`

---

### Agent 的三种核心能力

**推理（Reasoning）** — 不是机械执行，而是理解你的真实意图。你说"帮我看看竞品在做什么"，它知道要去搜索、归类、对比，而不是给你一个"竞品"的百科定义。

**工具使用（Tool Use）** — Agent 能操作的东西比聊天机器人多得多：搜索引擎、数据库、代码解释器、文件系统、第三方 API……工具越丰富，Agent 能干的事越多。

**记忆（Memory）** — Agent 记得之前做过什么、你的偏好是什么。这不是简单的对话历史存储，而是结构化的知识积累——就像一个有经验的老员工，越共事越默契。

---

### 为什么是现在？

2024 到 2025 年，三个关键变化同时发生了：

1. **大模型够聪明了。** Claude、GPT 等模型不仅能听懂复杂指令，还具备了真正的推理能力——它们会"思考"了。这是 Agent 能落地的基础。
2. **工具生态成熟了。** Function Calling、MCP 协议、各种 API 让模型能真正"动手"了。
3. **成本降下来了。** 一个复杂任务跑下来可能只花几毛钱，工程化部署变得可行。

Agent 开发不再是实验室里的研究课题。它已经是一门需要动手能力的**工程实践**——这就是你要学的。

---

### 学完这个教程，你能做什么？

本教程不会只给你讲概念。我们将从零开始，一步步构建真实的 Agent 系统：

- 用代码调用大模型，理解 API 交互
- 让 Agent 调用搜索、读写文件、执行脚本
- 设计 Agent 的记忆系统，让它越用越聪明
- 搭建完整的多工具 Agent，解决实际问题
- 最终：拥有一个你自己设计、自己实现的 AI Agent

你不需要 AI 博士学位，也无需精通数学。只要会写代码，保持好奇心，就足够了。

AI Agent 的时代才刚刚开始。现在上车，一点都不晚。`
);

insertArticle.run(
  "llm-basics",
  "LLM 与大模型基础",
  ch1Id,
  2,
  `## LLM 与大模型基础

上一章我们聊了 AI Agent 能做什么——帮你写报告、搜信息、发邮件。但你有没想过：Agent 是**怎么**理解你要什么、**怎么**决定下一步做什么的？

答案就是本章的主角：**大语言模型（LLM）**。它是 Agent 的大脑，所有的理解、推理、决策都在这里发生。

---

### 大模型到底"大"在哪？

你听过的那些名字——Claude、GPT、Gemini、DeepSeek——本质上都是同一类东西：在海量文本上训练出来的超大规模神经网络。

但"大"不是重点。重点是**大到某个临界点之后，模型突然出现了意想不到的能力**——它会推理了。

比如你问它：

> "如果所有的猫都是动物，所有的动物都需要呼吸，那么一只叫'橘子'的猫需要呼吸吗？"

简单的关键词匹配做不了这个。但大模型能——它不是在做"搜索"，它是在做**逻辑推导**。这种从海量数据中自然涌现的推理能力，就是 LLM 最核心的价值，也是 Agent 能"自主思考"的基础。

---

### LLM 是 Agent 的"大脑"

在 Agent 架构中，LLM 承担三个角色：

**理解者。** 你说"帮我看看最近 AI 圈发生了什么"，它知道你不是要它解释"发生了什么"这个短语，而是要它去搜索、筛选、总结最近的 AI 新闻。理解意图，而不是解析字面。

**规划者。** 面对一个模糊的目标，LLM 能自己拆出步骤。"写一份调研报告"→ 搜竞品 → 查融资 → 对比功能 → 整理表格 → 写结论 → 排版输出。

**决策者。** 搜到的信息太少？换关键词再试。代码执行报错了？读报错信息，修正后再跑。LLM 在每一步都能判断"这个结果够不够好、下一步该做什么"。

没有 LLM，Agent 只是一段预设好的自动化脚本。有了 LLM，Agent 才具备了**面对未知任务时的应变能力**。

---

### 主流模型怎么选？

市场上模型很多，关键是找到适合你场景的那一个。以下是从 Agent 开发角度的实用参考：

| 模型 | 适合场景 | 特点 |
|---|---|---|
| **Claude (Anthropic)** | Agent 开发首选 | 推理强、长上下文、代码能力顶级、安全性好 |
| **GPT (OpenAI)** | 多模态、生态集成 | 插件丰富、生态成熟、多模态原生支持 |
| **Gemini (Google)** | Google 生态 | 多模态强、与 Google 服务深度集成 |
| **DeepSeek** | 预算敏感、本地部署 | 开源、性价比极高、中文表现好 |
| **Llama (Meta)** | 完全本地化 | 开源、可私有部署、社区活跃 |

本教程将以 Claude 为主要模型来讲解 Agent 开发——它的推理能力、工具调用稳定性、以及长上下文支持，是目前做 Agent 最均衡的选择。

---

### Token：大模型怎么"读"文字？

大模型不是逐字阅读的。它把文字切成小块，每一块叫一个 **Token**。

直觉理解：
- 英文中，大概 1 个 Token ≈ 0.75 个单词。\`"Hello world"\` 是 2 个 Token。
- 中文中，大概 1 个 Token ≈ 1-2 个汉字。\`"你好世界"\` 大概 3-4 个 Token。
- 代码中，符号和关键词各算 Token。\`print("hello")\` 大约 5-6 个 Token。

为什么开发者要关心 Token？两个现实原因：

1. **成本。** API 按 Token 计费。你每问一次、Agent 每回答一次，都是真金白银。一个复杂 Agent 任务跑下来可能消耗几千甚至上万 Token——了解 Token 才能控制成本。
2. **上下文窗口。** 这是下一点——

---

### 上下文窗口：Agent 的"工作记忆"

LLM 一次能"看到"的 Token 总量，叫做上下文窗口（Context Window）。

这就像人的工作记忆——你脑子里同时能记住的东西是有限的。LLM 也一样：窗口越大，它能同时考虑的信息越多。

不同类型的模型，窗口大小差异很大：

- 早期模型：4K Token（大概 3000 个中文词）——只能处理短对话
- 当前主流模型：128K、200K Token——能塞进一整本书
- 最新模型如 Claude：支持到 200K+ Token

**上下文窗口对 Agent 来说是关键约束。** 想想为什么：Agent 执行一个复杂任务，可能需要十几轮甚至几十轮的工具调用。每一轮对话、每一个工具结果都占用上下文。如果窗口太小，Agent 就会"忘记"一开始的目标是什么、前面执行了什么步骤。

这就是为什么 Agent 开发者对上下文窗口特别敏感——它不是锦上添花的参数，而是决定了 Agent 能处理多复杂的任务。

---

### System Prompt：一句话改变模型的行为

你有没有过这种体验——同样一个问题，在不同时候问同一个模型，回答质量天差地别？

区别就在于 **System Prompt**。

简单说，System Prompt 是你在对话开始之前，给模型"下达的指令"——告诉它它是谁、该怎么做事、输出什么风格。它不会被用户看到，但整场对话都受它影响。

直觉上理解：一个没有任何 System Prompt 的模型就像一个刚入职的新员工——有能力，但不知道规矩。System Prompt 就是你的"员工手册"。

举一个对比你就懂了：

\`\`\`
# 没有 System Prompt
用户: 帮我写一段排序代码

# 有 System Prompt
System: 你是资深 Python 后端工程师。写代码时：(1) 注重可读性 (2) 包含类型注解 (3) 关键逻辑必须注释。输出完代码后，用一句话解释时间复杂度。
用户: 帮我写一段排序代码
\`\`\`

同一个问题，输出质量可以是"能跑就行"和"可以直接进生产环境"的差距。

在 Agent 开发中，System Prompt 的威力会被进一步放大——它不仅定义输出格式，还定义了 Agent 的**行为边界**：哪些事能做、哪些不能做、遇到不确定的情况该怎么处理。一个设计得当的 System Prompt，抵得上几百行业务逻辑代码。

后面我们会专门深入 Prompt 工程。现在你只需要知道这个直觉：**System Prompt 是 Agent 最便宜也最有效的"升级"方式，调好它比换模型更立竿见影。**

---

### 幻觉：为什么模型会"一本正经地胡说八道"？

你一定见过或者听说过这种事：ChatGPT 给你推荐了一篇论文，标题、作者、发表期刊都写得有模有样——但你一搜，这篇论文根本不存在。

这就是**幻觉（Hallucination）**——LLM 会自信地编造看起来合理但完全虚构的内容。

要理解幻觉，先要理解 LLM 的本质：它不是在"查数据库"，而是在"预测下一个 Token"。它每次的输出都是概率计算的结果——"在这个上下文中，下一个最可能出现的词是什么"。它不判断真假，只判断"像不像真的"。

对 Agent 开发者来说，幻觉是一个必须认真对待的问题。一个 Agent 去搜索信息→汇总成报告→发邮件给老板，如果中间某一步产生了幻觉，错误会被放大。这就是为什么 Agent 架构中需要**验证机制**——让 Agent 在关键步骤检查自己的输出，或者用外部工具交叉验证。

幻觉不能消除，但可以管控。理解了这一点，你就知道了 Agent 开发的底线在哪。

---

### 微调 vs RAG：同一个问题，两种解法

你可能会听到两个高频词：**微调（Fine-tuning）**和 **RAG（检索增强生成）**。它们要解决的是同一类问题——"怎么让模型知道它原本不知道的东西"——但思路完全不同。

**微调：把知识"教"给模型。** 在基础模型上，用你的专属数据继续训练。比如一家律所想用 LLM 审合同，就把历史上几千份合同和法律意见书喂给模型，让它学会法律术语和条款判断逻辑。微调之后，这些知识就"长"在模型参数里了。

**RAG：给模型"配"一个搜索引擎。** 不改模型本身，而是在提问前先去查资料，把查到的东西和问题一起给模型。还是律所的例子：每次审合同前，先从知识库里搜出相关法条和类似案例，附在问题后面，让模型"对着材料"审。

| | 微调 (Fine-tuning) | RAG |
|---|---|---|
| 原理 | 用新数据继续训练模型 | 先检索相关内容，再加到上下文 |
| 知识更新 | 需要重新训练 | 更新知识库即可 |
| 成本 | 需要数据和算力 | 需要知识库和检索系统 |
| 适合 | 学会一种"能力"（如法律推理） | 访问动态变化的知识（如最新政策） |

**实际生产环境往往是两者结合：** RAG 处理"今天的最新信息"，微调处理"领域特有的思维方式"。后面的章节我们会详细展开 RAG 的实现。

---

### 多模态：模型不再只有"耳朵"了

最早的大模型只能处理文字——你打字进去，它打字出来。但 2024 年之后，越来越多的模型开始"长眼睛"了。

**多模态（Multimodal）**就是模型能同时理解多种信息类型——文字、图片、音频、视频。

对 Agent 的想象力来说，这是质变。一个只有文字的 Agent 只能活在"文本世界"里；一个多模态 Agent 能做的是：看到一张 UI 设计稿→把它写成前端代码→截图比对→修正还原度。或者：收到一封包含数据表格截图的邮件→识别表格内容→录入数据库→生成分析报告。

和 Agent 最相关的多模态能力是**视觉理解**——Claude、GPT-4 等模型现在都能直接"看"图片。你给它一张架构图，它能理解各个模块的关系；你给它一张报错截屏，它能读报错信息并给出修复方案。

多模态不是锦上添花，它让 Agent 的能力边界从"文字世界"扩展到了"现实世界"。

---

### Embeddings：机器怎样"理解"一个词的真正含义？

你知道模型怎么判断"苹果"和"华为"是同一类东西（都是手机品牌），而"苹果"和"香蕉"才是另一类东西（都是水果）吗？

答案是 **Embeddings（嵌入向量）**——把文字变成一串数字，让意思接近的词，在数学上也接近。

你可以把它想象成：给每个词、每个句子在一个几千维的空间里找一个"坐标"。意思相近的东西，坐标也相近。"你好"和"Hello"虽然不是同一个语言，但在这个空间里，它们的坐标挨得很近。

这对 Agent 有什么用？它最核心的应用就是**语义搜索**。传统搜索是匹配关键词——搜"电脑"就不会返回包含"计算机"的文档。Embedding 搜索匹配的是意思——搜"怎么提高程序性能"，能返回"优化代码执行效率的方法"这类内容，即使一个共同的词都没有。

在 Agent 的记忆系统和 RAG 架构中，Embeddings 是底层基石——它们负责在浩如烟海的知识中找到"真正相关"的那几条信息。

---

### 一个思维转变：从"聊天"到"做事"

大多数人对 LLM 的认知停留在 ChatGPT 式的对话——问什么答什么。但 Agent 开发者的视角完全不同：

**我们把 LLM 看作一个推理引擎，而不是一个聊天工具。**

什么意思？你不是在和模型闲聊，而是在给它布置任务。它的输出不是"一段漂亮的回复"，而是"下一步该执行什么操作"。有时候，模型的输出甚至是给另一个程序读的（比如结构化的 JSON），你可能根本不会看到。

这个思维转变很重要。一旦你开始把 LLM 当成你系统里的一个"推理组件"，而不是一个"对话窗口"，你就真正进入了 Agent 开发的世界。

---

### 接下来

这一章我们建立了 Agent 开发者对 LLM 的基本认知。下一章，我们动手——把 Python、Node.js、Git 这些工具装好，把开发环境搭起来，开始写第一行代码。`
);

insertArticle.run(
  "env-setup",
  "环境配置",
  ch1Id,
  3,
	  `## 环境配置

在开始 AI Agent 开发之前，需要先把开发环境搭建好。一个完整的 Windows Agent 开发环境包含三个核心工具：**Git**（版本管理）、**Python**（AI 生态）、**Node.js**（Claude Code CLI 与前端工具链）。此外，由于大多数 AI API 服务需要访问境外服务器，我们还需要准备好网络环境。

本章以 **Windows 11** 为例，带你逐项完成安装和验证。Windows 10 的步骤几乎完全一致，可以放心参考。

---

### 1. 安装 Git

Git 是目前最主流的分布式版本控制系统。在 Agent 开发过程中，克隆开源项目、管理代码版本、团队协作都离不开 Git。

**版本要求：2.23+**

#### 下载与安装

打开浏览器，访问 Git 官网：[https://git-scm.com](https://git-scm.com)

首页会自动识别你的操作系统，点击右侧的 "Download for Windows" 按钮下载安装包。

![Git 官网首页，Windows 下载按钮](/images/git-install.png)

下载完成后，双击 \`.exe\` 文件启动安装向导。一路点"Next"保持默认选项即可，只有一步需要特别留意：

**在"Choosing the default editor"这一步**，默认编辑器建议从 Vim 改为你常用的编辑器。推荐选择 **"Use Visual Studio Code as Git's default editor"**（需要提前安装 VS Code）。如果还没装 VS Code，这里可以先保持默认，不影响后续使用。

> 其他选项全部默认即可。安装过程中会安装 Git Bash，这是一个在 Windows 上运行 Linux 风格命令的终端，后面会经常用到。

#### 验证安装

安装完成后，打开 **PowerShell** 或 **Windows Terminal**，输入：

\`\`\`powershell
git --version
# 输出示例: git version 2.47.0
\`\`\`

#### 基础配置

安装完成后，设置你的用户名和邮箱——这些信息会出现在每次 Git 提交记录中：

\`\`\`powershell
git config --global user.name "你的名字"
git config --global user.email "your-email@example.com"
\`\`\`

这两条命令执行完不会有任何输出，说明配置成功。可以通过以下命令验证：

\`\`\`powershell
git config --global user.name
git config --global user.email
\`\`\`

---

### 2. 安装 Python

Python 是 AI 开发的事实标准语言。无论是使用 Anthropic SDK、LangChain、LlamaIndex，还是运行本地模型推理，Python 都是最核心的运行时。

**版本要求：3.11+**

> 为什么是 3.11？Python 3.11 相比 3.10 有显著的性能提升（官方宣称 10-60%），目前主流 AI 库（transformers、langchain、openai 等）都已完整支持 3.11+。

#### 下载与安装

打开浏览器，访问 Python 官网：[https://www.python.org/downloads/](https://www.python.org/downloads/)

页面会自动推荐最新的 Python 版本，点击黄色 "Download Python" 按钮下载安装包。

![Python 官网下载页面，Windows installer](/images/python-install.png)

下载完成后，双击 \`.exe\` 启动安装向导。**这是整个环境配置中最关键的一步，注意看：**

**在安装向导的第一个界面，务必将最底部的 "Add Python to PATH" 复选框勾上。** 如果没有勾选，后面在命令行中敲 \`python\` 命令会报"找不到命令"。

![Python 安装向导，务必勾选 Add Python to PATH](/images/python-path.png)

勾选 PATH 后，点击 "Install Now" 等待安装完成即可。其他选项保持默认。

#### 验证安装

打开 **PowerShell** 或 **Windows Terminal**，输入：

\`\`\`powershell
python --version
# 输出示例: Python 3.12.3

pip --version
# 输出示例: pip 24.0
\`\`\`

> 注意：Windows 上 Python 的命令是 \`python\`（不是 \`python3\`）。如果 \`python\` 没反应，说明 PATH 没有生效——重启终端再试。

#### 推荐：使用虚拟环境

在 Python 项目中，建议为每个项目创建独立的虚拟环境，避免不同项目的依赖互相冲突：

\`\`\`powershell
# 创建虚拟环境（在项目目录下执行）
python -m venv my-agent-env

# 激活虚拟环境
my-agent-env\\Scripts\\activate
\`\`\`

激活成功后，命令行前面会出现 \`(my-agent-env)\` 标识。此后用 pip 安装的任何包都只在当前项目生效。

退出虚拟环境：

\`\`\`powershell
deactivate
\`\`\`

---

### 3. 安装 Node.js

Node.js 是运行 Claude Code CLI 的必备环境，同时也是构建前端 Agent 应用的基石。

**版本要求：20+（LTS）**

> 推荐安装 **LTS（长期支持版）**，稳定性最高。奇数版本号（如 21、23）是实验版，不建议用于开发环境。

#### 下载与安装

打开浏览器，访问 Node.js 官网：[https://nodejs.org](https://nodejs.org)

首页会显示两个大按钮：左边是 LTS 版本（推荐），右边是 Current 版本（尝鲜）。**点击左边的 LTS 按钮**下载安装包。

![Node.js 官网首页，LTS 下载按钮](/images/node-install.png)

下载完成后，双击 \`.msi\` 启动安装向导。一路点"Next"保持默认即可——安装程序会自动把 Node.js 加入 PATH，不需要额外的配置步骤。

安装向导最后一步有一个 "Automatically install the necessary tools" 的选项，可以取消勾选（那是用于编译 C++ 原生模块的工具，暂时用不到，后面需要时再装）。

#### 验证安装

打开 **PowerShell** 或 **Windows Terminal**，输入：

\`\`\`powershell
node --version
# 输出示例: v22.12.0

npm --version
# 输出示例: 10.9.0
\`\`\`

npm 是 Node.js 自带的包管理器，安装 Node.js 后自动可用，无需额外安装。

---

### 4. 网络环境准备

目前主流的 AI API 服务（Anthropic、OpenAI、Google AI 等）都需要访问境外服务器。如果你在国内，建议提前准备好网络工具。

> 推荐：[https://ac.goyesha.com/](https://ac.goyesha.com/)

请自行选择稳定的网络方案，确保后续能够正常调用 API。后面的章节中安装 Claude Code 和配置 cc-switch 时，都需要稳定的网络连接。

---

### 安装顺序建议

推荐按照 **Git → Python → Node.js** 的顺序安装，这是从底层到上层、从通用到专用的关系。只有 Git 的顺序是灵活的——它和其他两个工具没有依赖关系。

---

### 检查清单

全部完成后，打开 **PowerShell** 或 **Windows Terminal**，依次运行以下五条命令：

\`\`\`powershell
git --version
python --version
pip --version
node --version
npm --version
\`\`\`

![终端中五条命令全部验证通过](/images/env-verify.png)

五条命令全部输出版本号、没有任何报错——恭喜，你的 Windows AI Agent 开发环境已经准备就绪。下一章，我们将学习如何使用 API 与 LLM 进行交互。`
);

insertArticle.run(
  "popular-agents",
  "热门Agent安装",
  ch1Id,
  4,
  `## 热门Agent安装

内容正在编写中，敬请期待。

本章将介绍当下最值得关注的 AI 智能体产品和工具。`
);

insertArticle.run(
  "claude-code",
  "Claude Code",
  ch1Id,
  5,
  `## Claude Code

前面几章，你配好了 Git、Python、Node.js 的开发环境，也弄懂了 LLM 是怎么"读懂"文字的。现在，你最想做的事情只有一件——**亲手跑一个 AI Agent，看看它到底有多聪明。**

而 Claude Code，正是 Anthropic 官方发布的命令行 AI 编程助手。它不是网页聊天框，而是一个真正跑在你终端里的 Agent——能读你的代码、写你的文件、执行你的命令。

听起来很美好，但有一个现实问题：Claude Code 官方要求 Anthropic 的 API Key，需要海外信用卡，价格也不便宜。这时候，就该 **cc-switch** 出场了。

---

### 什么是 cc-switch？

**把 cc-switch 想象成一个"中转站"。**

Claude Code 本来要跟 Anthropic 的服务器对话。cc-switch 坐在中间，拦下这些请求，转发给你选择的第三方 API 服务商——比如国内的 Kimi、DeepSeek 等。

对你来说，体验完全一样：终端里敲 \`claude\`，正常聊天、写代码。只是背后的 API 走了另一条路。

**一句话总结：cc-switch 让 Claude Code 以为自己在跟 Anthropic 服务器说话，实际上对话的另一端可以是任何兼容的 API。**

这样做的好处很明显：
- 用国内服务商的 API Key，微信/支付宝就能充值
- 价格选择更灵活，很多服务商还有免费额度
- 不受地域限制，国内网络直接可用

> **注意：** 官方 Anthropic API 的效果仍然是最好的。cc-switch 是一个降低门槛的实用方案，适合学习和日常开发。生产环境建议评估后再做选择。

---

### 前提条件

开始之前，请确认以下条件：

- **Node.js 20+** 已安装（参考[环境配置](/env-setup)章节的 Node.js 安装步骤）
- **终端工具**可用（Windows 推荐 PowerShell 或 Windows Terminal）
- 一个**第三方 API 服务商的账号**（下一步会讲怎么获取）

---

### 第一步：获取 API Key

你需要先在第三方 API 服务商那里注册账号、获取密钥。这里推荐几个常用的：

| 服务商 | 特点 | 推荐理由 |
|---|---|---|
| **Kimi（月之暗面）** | 新用户 15 元免费额度 | 门槛最低，适合尝鲜 |
| **DeepSeek** | 价格低，兼容性好 | 性价比高 |
| **火山引擎** | 字节跳动旗下，模型丰富 | 企业用户友好 |

流程大致是：

1. 访问服务商官网，注册账号
2. 在控制台找到"API Key"或"密钥管理"页面
3. 创建一个新的 API Key，复制保存

> **重要提示：** 在充值或获取 Key 之前，建议先查看该服务商的**接口文档**，确认支持哪些模型。不同服务商的模型名称可能不同——比如 Anthropic 官方叫 \`claude-sonnet-4-20250514\`，而某个第三方可能叫 \`claude-4-sonnet\`。先搞清楚模型名，后面配置才不会出错。

---

### 第二步：安装 cc-switch

cc-switch 提供两种安装方式，任选其一即可。

#### 方式一：安装包（推荐）

1. 访问 [cc-switch Releases](https://github.com/farion1231/cc-switch/releases) 页面
2. 下载最新版本的 \`CC-Switch-v{版本号}-Windows.msi\`
3. 双击运行安装程序，按提示完成安装

#### 方式二：绿色免安装版

1. 下载 \`CC-Switch-v{版本号}-Windows-Portable.zip\`
2. 解压到任意目录（比如 \`D:\\tools\\cc-switch\`）
3. 运行 \`CC-Switch.exe\`

安装完成后，打开 cc-switch，你会看到它的主界面：

![cc-switch 主界面](/images/cc-switch-overview.png)

界面简洁，核心区域就是你的 API 配置列表——现在还是空的，我们稍后填充。

---

### 第三步：安装 Claude Code

打开终端，执行一行命令：

\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

这个命令会把 \`claude\` 安装为全局命令。安装完成后，可以验证一下：

\`\`\`bash
claude --version
\`\`\`

正常情况下，Claude Code 此时会要求你登录 Anthropic 账号。但因为我们用了 cc-switch，它会帮我们接管这个认证流程——所以先别急着运行，先把 cc-switch 配好。

---

### 第四步：配置 cc-switch

这是最关键的一步。按照下面的顺序操作：

**1. 打开设置**

点击 cc-switch 左上角的设置图标（齿轮），进入设置页面。

勾选下图所示的选项——这些选项确保 cc-switch 能正确拦截和转发 Claude Code 的请求：

![cc-switch 设置选项](/images/cc-switch-settings.png)

**2. 添加 API Key 配置**

回到主界面，点击右上角的 **"+"** 按钮，弹出配置对话框：

![cc-switch 添加 API Key](/images/cc-switch-apikey.png)

**3. 填写配置信息**

在对话框中填入以下内容：

- **API Key**：粘贴你在第一步获取的密钥
- **API Address**：填入服务商提供的 API 地址（各服务商的控制台页面会有说明）
- **Model**：填入你想使用的模型名称

配置完成后，点击确定保存。

**4. 填写模型名称**

模型名称这一栏是最容易出错的地方。不同服务商的模型名各不相同，**务必以服务商文档为准**。比如：

![cc-switch 模型名称](/images/cc-switch-model.png)

> **常见坑点：** 模型名填错了，Claude Code 会直接报错连不上。如果遇到连接失败，第一件事就是检查模型名拼写是否和服务商文档一致——空格、大小写、连字符，一个都不能差。

---

### 第五步：验证安装

一切就绪。打开终端，输入：

\`\`\`bash
claude
\`\`\`

进入 Claude Code 的交互界面后，发送一条测试消息：

\`\`\`
你好
\`\`\`

如果 Claude Code 正常回复了——恭喜你，整个链路已经打通！

![Claude Code 成功回复](/images/claude-code-success.png)

这条简单的"你好"，背后实际上经过了：

1. 终端 → cc-switch（拦截请求）
2. cc-switch → 第三方 API 服务商（转发请求，带上你的 API Key）
3. 服务商 → 调用大模型 → 返回结果
4. cc-switch → 终端（返回响应）

整个链路跑通了，说明你的 API Key 有效、模型名正确、cc-switch 工作正常。**这个验证虽然简单，但每一步都可能出问题——通过了就说明你的环境完全就绪。**

---

### 常见问题

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| 终端提示 \`claude\` 命令找不到 | npm 全局 bin 不在 PATH 中 | 重启终端，或检查 npm 全局安装路径是否已加入 PATH |
| 连接超时 / Connection Refused | cc-switch 未启动，或网络不通 | 确认 cc-switch 正在运行，检查网络工具是否正常 |
| 401 Unauthorized | API Key 无效或已过期 | 回到服务商控制台确认 Key 状态，检查账户是否有余额 |
| Model Not Found 错误 | 填写的模型名与服务商不一致 | 仔细对照服务商文档，确认模型名的拼写和大小写 |
| Claude Code 弹出 Anthropic 登录页 | cc-switch 设置中的拦截选项未开启 | 回到设置页面，确认相关选项已勾选 |

---

### 接下来

安装配置就到这里。现在你的终端里已经有了一个能写代码、能读文件、能执行命令的 AI Agent——试着给它一个实际任务，比如"帮我看看这个项目里有没有重复的代码"，你会第一次感受到，Agent 和聊天框真的是两种东西。

Claude Code 本身的功能远不止此。下一章，我们来看看 OpenClaw——另一个同样值得关注的开源智能体工具。`
);

insertArticle.run(
  "openclaw",
  "OpenClaw",
  ch1Id,
  6,
  `## OpenClaw

内容正在编写中，敬请期待。

本章将涵盖：

- OpenClaw 是什么
- 核心功能与架构
- 安装与快速上手
- 与 Claude Code 的对比与配合`
);

// ========== 工具篇 ==========
insertArticle.run(
  "skill-recommend",
  "Skill 推荐与使用",
  ch2Id,
  1,
  `## Skill 推荐与使用

内容正在编写中，敬请期待。

本章将涵盖：

- 什么是 Skill 系统
- 常用 Skill 推荐
- Skill 的安装与配置
- 自定义 Skill 开发`
);

insertArticle.run(
  "superpowers",
  "Superpowers",
  ch2Id,
  2,
  `## Superpowers

Skill 的核心价值在于：把工作习惯固化成可复用的指令模板。但有一个实际问题：Skill 的文件放在哪？怎么管理？多个 Skill 之间怎么协作？怎么让别人写的 Skill 在你的机器上也能用？

**Superpowers 就是回答这些问题的。**

它是 Claude Code 的官方插件系统，负责 Skill 的发现、加载、管理和执行。如果 Skill 是"工作手册"，Superpowers 就是"图书管理员"——它知道所有手册在哪、每本手册什么时候该拿出来。

---

### Superpowers 是什么？

一句话：**Superpowers 是 Claude Code 的插件生态基础设施。**

它做了三件事：

1. **Skill 管理**——发现、加载、切换 Skill。你把 Skill 文件放到指定目录，Superpowers 自动识别并注册为可调用命令。
2. **插件分发**——一个统一的安装渠道。开发者把自己的 Skill 打包发布，用户一行命令安装。
3. **运行时支持**——提供子 Agent 编排、工具权限控制、上下文管理等底层能力，让 Skill 能做更复杂的事。

Superpowers 本身是 Claude Code 的一个插件（通过 \`claude plugins install superpowers\` 安装），安装后它会接管 Skill 相关的全部功能。

---

### 安装 Superpowers

安装只需要一条命令：

\`\`\`bash
claude plugins install superpowers
\`\`\`

或者，在 Claude Code 的交互界面中直接输入：

\`\`\`
/add-superpowers
\`\`\`

安装过程完全自动——Superpowers 会下载必要的文件、配置好 Skill 目录、注册所有内置 Skill。整个过程通常在 30 秒内完成。

安装完成后，你可以验证一下：

\`\`\`
/brainstorming
\`\`\`

如果 Claude Code 切换到头脑风暴模式、开始按结构化流程跟你对话，说明 Superpowers 已经正常工作了。

---

### Superpowers 的目录结构

安装后，Superpowers 在你的项目或用户目录下创建如下结构：

\`\`\`
.claude/
├── skills/           # 你的 Skill 文件放这里
│   ├── brainstorming.md
│   ├── debugging.md
│   └── my-custom-skill.md
├── commands/         # 自定义 slash 命令
├── hooks/            # 事件钩子（如提交前自动审查）
└── settings.json     # Superpowers 的全局配置
\`\`\`

把 Skill 的 Markdown 文件丢进 \`skills/\` 目录，Superpowers 会自动发现并加载——不需要重启、不需要手动注册。这种"即放即用"的体验，让自定义 Skill 的成本降到了几乎为零。

---

### 内置 Skill 一览

Superpowers 自带一批高质量的 Skill，覆盖了开发中最常见的场景：

| Skill | 用途 | 适用场景 |
|---|---|---|
| **brainstorming** | 结构化的头脑风暴和方案设计 | 开始任何复杂任务前先调用，避免方向跑偏 |
| **debugging** | 系统化的 Bug 排查流程 | 遇到 Bug 时，按"复现→定位→修复→验证"流程走 |
| **code-review:code-review** | 多子 Agent 并行代码审查 | PR 提交前，多维度并行审查 |
| **frontend-design** | 遵循设计系统的前端开发 | 写 UI 代码时，先读取现有设计系统再动手 |
| **mcp-builder** | 构建 MCP 协议服务 | 按 Spec 驱动的流程开发 MCP Server |
| **using-superpowers** | Superpowers 自身的使用指南 | 怎么找 Skill、怎么调用、怎么管理 |

每个 Skill 都是一个独立的 Markdown 文件。你可以在 \`.claude/skills/\` 目录里打开任何一个看看——它们是用纯文本写的，你可以直接阅读、修改、甚至复制一份作为你自己 Skill 的模板。

---

### 子 Agent 编排：Skill 的高级能力

Superpowers 最有特色的特性之一是**子 Agent 编排**。

普通的 Claude Code 对话是"单线程"的——你问一句，它做一件事。但 Superpowers 允许一个 Skill 启动多个**子 Agent（Sub-agents）**并行工作。

以 \`code-review:code-review\` 为例，当你调用它时，Superpowers 会在后台启动 5 个并行的子 Agent：

- Agent #1：检查代码是否符合 CLAUDE.md 规范
- Agent #2：扫描明显的 Bug
- Agent #3：从 Git 历史中分析潜在问题
- Agent #4：检查之前类似 PR 的 review 意见
- Agent #5：验证代码注释中的约束是否被遵循

每个子 Agent 独立工作，完成后将发现的问题汇总。Superpowers 对结果进行置信度评分，过滤掉低质量或误报的发现，最后生成一份结构化的审查报告。

**这不只是"写得更快"，而是改变了工作方式**——一个人 + 多个 AI Agent 并行协作，每个人（Agent）有独立的分工。这是 Agent 开发中最令人兴奋的方向之一。

---

### 配置 Superpowers

Superpowers 的行为可以通过 \`settings.json\` 进行配置。常用的配置项包括：

\`\`\`json
{
  "skills": {
    "autoActivate": true,
    "directory": ".claude/skills"
  },
  "hooks": {
    "preCommit": "code-review",
    "autoFormat": true
  },
  "agents": {
    "maxParallel": 5,
    "defaultModel": "sonnet"
  }
}
\`\`\`

几个关键的配置说明：

- **skills.autoActivate**：是否允许 Skill 根据关键词自动激活（而不是必须手动 \`/skill-name\` 调用）
- **skills.directory**：Skill 文件存放的目录路径
- **hooks.preCommit**：Git 提交前自动触发的 Skill（比如自动代码审查）
- **agents.maxParallel**：并行子 Agent 的最大数量
- **agents.defaultModel**：子 Agent 默认使用的模型

---

### Hooks：自动化工作流

Superpowers 的另一个核心功能是 **Hooks（钩子）**——在特定事件发生时自动触发 Skill。

常见的事件包括：

| 事件 | 触发时机 | 可绑定的 Skill 示例 |
|---|---|---|
| **pre-commit** | Git 提交前 | code-review（自动审查即将提交的代码） |
| **post-edit** | 文件被修改后 | linter（自动运行代码检查） |
| **session-start** | 新会话开始时 | my-coding-style（自动加载编码偏好） |
| **pre-push** | 推送到远程前 | security-audit（安全检查） |

例如，你可以配置在每次 Git 提交前自动运行代码审查：

\`\`\`json
{
  "hooks": {
    "preCommit": "code-review:code-review",
    "sessionStart": "using-superpowers"
  }
}
\`\`\`

配置后，每次 \`git commit\`，Superpowers 会自动启动 code-review Skill 审查你的改动——不需要手动记得去调用。这种自动化让你在团队协作中保持一致的代码质量标准。

---

### 写一个你自己的 Superpowers Skill

自定义 Skill 本质上就是写 Markdown。一个基础的 Skill 文件结构如下：

\`\`\`markdown
---
name: my-coding-style
description: 我的个人编码规范，用于所有代码生成和审查
---

## 行为准则

1. 只在逻辑不直观的地方写注释
2. 三个类似的行比一个过度抽象的类好
3. 改 Bug 时只修 Bug，不要顺手重构
4. 不用 emoji
\`\`\`

把文件放到 \`.claude/skills/\` 目录，Superpowers 自动发现并注册。在此基础上，这里补充 Superpowers 特有的两个进阶能力：

**1. 子 Agent 并行**

在 Skill 中定义需要并行启动的子 Agent：

\`\`\`markdown
---
name: project-audit
description: 项目全面审计
---

## 审计流程

启动以下子 Agent 并行工作：

1. **安全检查 Agent**：扫描依赖漏洞、密码泄露、不安全的配置
2. **性能分析 Agent**：找出性能瓶颈、未使用的依赖、过大的包
3. **代码质量 Agent**：检查代码复杂度、重复代码、测试覆盖率
4. **文档审计 Agent**：检查缺失的文档、过时的 README、无注释的公共 API

汇总各 Agent 的结果，生成一份完整的审计报告。
\`\`\`

**2. 工具权限控制**

你可以指定 Skill 中能使用和不能使用的工具：

\`\`\`markdown
---
name: safe-refactor
description: 安全的代码重构，禁止执行命令
allowed_tools: [Read, Edit, Write]
forbidden_tools: [Bash]
---

## 重构规则

这个 Skill 只能读写文件，不能执行任何 Shell 命令——确保重构过程不会意外运行危险的脚本。
\`\`\`

---

### Superpowers 与 Claude Code 的关系

一个容易混淆的点：Claude Code 是终端应用，Superpowers 是它的插件。

两者的分工：

- **Claude Code** 提供基础能力——调用 LLM、读写文件、执行命令、管理对话
- **Superpowers** 在基础能力之上，提供 Skill 管理、子 Agent 编排、自动化工作流

你可以不用 Superpowers 直接用 Claude Code——所有基础功能都正常工作。但一旦你需要"让 Claude Code 记住你的工作方式"或者"让自动化接管重复的流程"，Superpowers 就是那个缺失的拼图。

类比：Claude Code 是操作系统，Superpowers 是桌面环境。没有桌面环境系统照样跑，但有了它，你的日常操作快好几倍。

---

### 接下来

Superpowers 和 Skill 系统是你提升 Claude Code 效率的"捷径"。一旦习惯了这个工作方式——用 brainstorming 理清方向、用 code-review 守住质量、用自定义 Skill 固化团队标准——回到"裸机"模式会觉得少了一层安全感。

下一章，我们来看 **Remotion**——一个用 React 写代码就能生成视频的工具。你会看到，当你把 Remotion 和 Claude Code 配合使用，自动化视频生产这件事会变得前所未有的简单。`
);

insertArticle.run(
  "remotion",
  "Remotion",
  ch2Id,
  3,
  `## Remotion

你有没有想过——不用打开任何视频编辑软件，不用学 Premiere 或 After Effects，你用 React 写一段代码，然后它就变成了一段 MP4 视频。

标题从下方弹入、Logo 旋转渐显、背景色随时间渐变、字幕跟音乐节奏跳动——所有这些效果，不是用鼠标拖时间轴做出来的，而是用 \`interpolate\`、\`spring\`、\`Sequence\` 这些你早已熟悉的编程概念写出来的。

这就是 **Remotion**。

---

### 什么是 Remotion？

一句话：**Remotion 是一个用 React 组件"写"视频的框架。**

它的核心理念极其简单——视频是什么？就是一帧一帧的图像按时间顺序播放。每一帧是一个画面，30 帧连在一起就是一秒的视频。Remotion 做的事情就是：**给每一帧一个编号，让你用 React 渲染那个编号对应的画面。**

\`\`\`
帧 0 → React 渲染 → 画面 0（标题还没出现）
帧 15 → React 渲染 → 画面 15（标题半透明）
帧 30 → React 渲染 → 画面 30（标题完全显示）
\`\`\`

传统的视频制作像是在"画"每一帧（用鼠标拖拽、调参数），Remotion 是在"算"每一帧（用代码描述画面如何随时间变化）。前者直观但难以精确控制；后者需要写代码但具备极致的力量——你可以用变量、循环、条件判断、API 数据来驱动视频内容。

对于已经会用 React 的你来说，入门 Remotion 的学习曲线几乎为零——你不需要学任何新概念，把 \`<div>\` 替换成 \`<Composition>\`，把 \`useState\` 替换成 \`useCurrentFrame\`，视频创作就开始了。

---

### 为什么 Remotion + Claude Code 是绝配？

理论上 Remotion 用 React 写视频已经很方便了。但实际上，写"随时间变化的视觉效果"仍然需要对动画参数反复调试——弹入快一点还是慢一点？透明度从第几帧开始变化？

这正是 Claude Code 擅长的事。

更关键的是：**Remotion 官方专门为 AI Agent 开发了一套 Skill**，托管在 GitHub 上（[remotion-dev/skills](https://github.com/remotion-dev/skills)）。这套 Skill 教会 Claude Code 如何正确使用 Remotion 的 API——比如动画必须用 \`interpolate()\` 而不是 CSS animation、Composition 必须在 Root 中注册、\`useCurrentFrame\` 的返回值从 0 开始等等。

没有这套 Skill，Claude Code 会按"写网页"的思维生成代码（用 CSS keyframes、用 setTimeout），那些在浏览器里能跑，但在 Remotion 的渲染管线里完全无效。有了 Skill，Claude Code 就像一个了解 Remotion 规则的视频开发者，生成的代码能直接在 Remotion Studio 里预览和渲染。

---

### 第一步：下载 Remotion Skill

我们不通过 npm 全局安装，而是直接从 GitHub 获取 Skill 文件：

打开浏览器，访问 [https://github.com/remotion-dev/skills](https://github.com/remotion-dev/skills)，下载项目的 ZIP 包（点击绿色的 "Code" 按钮 → "Download ZIP"），解压到你想存放的目录。

![GitHub 上 remotion-dev/skills 项目页面](/images/remotion-skill-github.png)

> 为什么不全局安装？Remotion Skill 本质上是一组 Markdown 指令文件（SKILL.md），放在项目目录里让 Claude Code 自动读取即可。下载到本地比全局安装更灵活——你可以在不同项目中用不同版本的 Skill，而且不污染全局环境。

解压后，你会看到类似这样的目录结构：

\`\`\`
remotion-dev-skills/
├── SKILL.md              # Skill 入口：定义何时触发、行为规则
├── references/           # API 参考文档
├── rules/                # 代码规范（ESLint、最佳实践）
└── examples/             # 示例项目
\`\`\`

---

### 第二步：加载 Skill

打开终端，进入你的 Remotion 项目目录（如果还没有项目，先运行 \`npx create-video@latest\` 创建一个），然后输入：

\`\`\`bash
claude <Skill解压目录的路径>
\`\`\`

比如你把 Skill 解压到了 \`D:\\skills\\remotion-dev-skills\`，就输入：

\`\`\`bash
claude D:\\skills\\remotion-dev-skills
\`\`\`

Claude Code 启动时会自动读取 Skill 目录下的所有指令文件，把 Remotion 的开发规范加载到上下文中。之后你在这个对话里描述任何视频需求，Claude Code 都会按 Remotion 的 API 规范生成代码。

![终端中输入 claude + Skill 路径，自动加载 Remotion Skill](/images/remotion-claude-load.png)

> 也可以把 Skill 目录直接放到项目的 \`.claude/skills/\` 下——Superpowers 会自动发现并注册。之后在任何对话中输入 \`/remotion\` 即可激活。

---

### 核心概念速览

写 Remotion 视频，你只需要掌握这几个 API：

**Composition —— 注册视频**

每一段视频都是一个 Composition。它在 \`src/Root.tsx\` 中注册，绑定组件、时长、分辨率和帧率：

\`\`\`tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}  // 150帧 ÷ 30fps = 5秒
    fps={30}
    width={1920}
    height={1080}
  />
);
\`\`\`

**useCurrentFrame —— 动画的心脏**

这是 Remotion 最重要的 Hook。它返回当前正在渲染的帧编号（从 0 开始）。所有动画都基于这个值：

\`\`\`tsx
import { useCurrentFrame } from "remotion";

export const MyVideo = () => {
  const frame = useCurrentFrame(); // 0, 1, 2, 3, ...
  return <div>当前帧: {frame}</div>;
};
\`\`\`

**interpolate —— 把帧号变成动画值**

\`interpolate\` 是最常用的动画工具。它把一个数值范围映射到另一个数值范围：

\`\`\`tsx
import { useCurrentFrame, interpolate } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  // 帧 0→30：opacity 从 0 平滑过渡到 1
  return <div style=\{{ opacity }}>渐入的文字</div>;
};
\`\`\`

**spring —— 让动画更有"弹性"**

\`spring\` 基于物理弹簧模型，产生自然的回弹效果（Bounce 感）：

\`\`\`tsx
import { useCurrentFrame, spring } from "remotion";

export const BounceIn = () => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30 });
  // 值从 0 快速弹到 1，带自然回弹
  return <div style=\{{ transform: \`scale($\{scale})\` }}>弹入!</div>;
};
\`\`\`

**Sequence —— 编排时间线**

\`Sequence\` 让多个组件按时间顺序出现：

\`\`\`tsx
import { Sequence } from "remotion";

export const Timeline = () => (
  <>
    <Sequence from={0} durationInFrames={40}>
      <Title text="第一幕" />
    </Sequence>
    <Sequence from={40} durationInFrames={50}>
      <Title text="第二幕" />
    </Sequence>
    <Sequence from={90} durationInFrames={60}>
      <Title text="第三幕" />
    </Sequence>
  </>
);
\`\`\`

这五个 API 就是你写 Remotion 视频的全部基础。剩下的——布局、样式、数据获取——都是你本来就会的 React。

---

### 实战：从一句话到一个视频

现在把整个流程串一遍。

你在 Claude Code（已加载 Remotion Skill）的对话中输入：

> "创建一个 5 秒的产品宣传片头：标题'AI Agent 开发指南'从画面下方弹入，背景从黑色渐变到深蓝色，右上角有一个旋转的 Logo 图标。"

Claude Code 会生成完整的 Remotion 组件代码，包含：

- 一个 \`Composition\` 注册（1920×1080，30fps，150 帧）
- 用 \`spring()\` 驱动标题弹入动画
- 用 \`interpolate()\` 驱动背景色渐变
- 用 \`useCurrentFrame()\` 和 CSS transform 驱动 Logo 旋转

把生成的代码保存到 \`src/MyVideo.tsx\`，在 \`src/Root.tsx\` 中注册好 Composition，然后启动 Remotion Studio：

\`\`\`bash
npm run dev
\`\`\`

浏览器会自动打开 Remotion Studio。你能在左侧看到你的 Composition 列表，中间是实时预览窗口，底部是时间轴。拖动时间轴播放头，或者直接点播放——你会看到标题从下方弹入、背景渐渐变蓝、Logo 在旋转。

不满意标题弹入的速度？回到 Claude Code 对话：**"标题弹入再快一点，现在太慢了"**。Claude Code 会调整 \`spring()\` 的参数。修改代码后，Remotion Studio 自动热重载——效果立刻可见。

这就是「自然语言 → 代码 → 视频」的完整闭环。

---

### 渲染输出

效果满意后，一键渲染为 MP4：

\`\`\`bash
npx remotion render MyVideo out/video.mp4
\`\`\`

![终端中 Remotion 渲染进度，Render complete](/images/remotion-render.png)

Remotion 支持的输出格式：

| 格式 | 编码 | 适用场景 |
|---|---|---|
| MP4 | H.264（默认）/ H.265 | 通用视频分发 |
| WebM | VP8 / VP9 | 网页嵌入，支持透明通道 |
| GIF | — | 短动画、社交媒体 |

对于批量视频需求（比如给 1000 个用户生成个性化年终总结），Remotion 还支持云渲染：通过 \`@remotion/lambda\` 在 AWS Lambda 上并行渲染，或者通过 \`@remotion/cloudrun\` 在 Google Cloud Run 上执行。

---

### 适用场景

| 场景 | 为什么 Remotion 特别适合 |
|---|---|
| **产品宣传视频** | 标题、动画、转场全用代码控制，精确到每一帧 |
| **数据可视化动画** | 配合 D3.js 或 Chart.js，让图表"长出来" |
| **社交媒体短视频** | 字幕逐词高亮（TikTok 风格）、自动适配竖屏尺寸 |
| **批量个性化视频** | 参数化模板 + CSV 数据源 → 自动生成千人千面的视频 |
| **教程/文档视频** | 代码演示 + 高亮 + 旁白字幕，全流程自动化 |

---

### 接下来

Remotion 把视频创作从"操作软件"变成了"写代码"。而 Claude Code 加上 Remotion Skill，又进一步把"写代码"变成了"说话"。

从前你需要学 Premiere 的时间轴、关键帧、转场面板。现在你只需要会写 React 组件，然后告诉 Claude Code 你想要什么效果。这是两个工具配合之后产生的化学反应——单独用 Remotion 已经很强，加上 AI Agent 之后，门槛直接从"学会一个专业软件"降到了"描述你的想法"。

下一章，我们进入**提示词工程**——学习怎么把"描述你的想法"这件事做到极致，让 AI 准确理解你的意图，一次生成就接近最终效果。`
);

insertArticle.run(
  "prompt-engineering",
  "提示词工程",
  ch2Id,
  4,
  `## 提示词工程

在 LLM 基础那一章，我们聊过一个关键洞察：**System Prompt 是 Agent 最便宜也最有效的"升级"方式，调好它比换模型更立竿见影。** 现在是时候把这个洞察变成一门手艺了。

提示词工程（Prompt Engineering）听起来很高大上，但它的本质非常简单：**用最少的字，让模型做出最准的事。** 这不是玄学，不是"多夸模型几句它就更聪明"，而是一套可以通过实验、迭代、量化验证的设计方法。

本章不教你写"请扮演一个专家"这种模板。我们要讨论的是：在 Agent 系统中，提示词怎么设计才能让模型可靠地决策、稳定地调用工具、在长对话中不跑偏。

---

### 什么是好的 Prompt？

先看一个例子。你让模型帮你写一段代码审查意见：

**Prompt A（模糊）：**

> "帮我看看这段代码有没有问题。"

**Prompt B（结构化）：**

> "审查下面这段 TypeScript 代码。检查三个维度：(1) 类型安全——是否有 \`any\` 或类型断言缺口；(2) 错误处理——异常路径是否被覆盖；(3) 可读性——命名是否自解释。每个问题给出严重程度（高/中/低）和建议修复方案。输出格式：先用一句话总结，再用列表逐条列出发现。"

同一个模型，Prompt A 的回复可能是"看起来没什么大问题，不过你可以加一些类型注解"——安全但空洞。Prompt B 的回复会是一份结构化的审查报告，每一条都有严重程度和修复建议。

区别在哪？**好的 Prompt 给模型提供了一个清晰的"工作框架"**——它知道自己要检查什么、按什么标准、输出什么格式。差的 Prompt 给了模型太大的自由度，它只好猜你想要什么。

![同一问题，左边是模糊 Prompt 的输出，右边是结构化 Prompt 的输出](/images/prompt-compare.png)

> 📷 **截图说明**：截取两段 Claude Code 对话的对比。左边是 "帮我看看这段代码有没有问题" 的模糊回复，右边是结构化 Prompt 的详细审查报告。

---

### Prompt 设计的五个原则

不是教条，但每次写 Prompt 时对照一下，能省很多调试时间：

**1. 角色先行，但别废话。** "你是资深 Python 后端工程师"比"你是一个资深的、有十年经验的、在大厂工作过的 Python 后端工程师，代码风格干净优雅……"好得多。模型不需要你夸它——角色定义一把抓住核心即可。角色决定模型的**思考框架**，不是它的心情。

**2. 给出工作步骤。** 与其说"做得好一点"，不如告诉它怎么做。"先分析代码结构 → 再找出潜在的性能瓶颈 → 最后给出优化建议"——三步走，模型每步都知道自己在干什么。这就是 Chain-of-Thought 的核心理念，我们稍后会展开。

**3. 约束输出格式。** 这不是在限制模型的创造力，而是在帮它集中注意力。"用 JSON 返回结果"、"每条建议不超过两句话"、"先结论后分析"——格式越明确，模型的输出越可预测。在 Agent 系统中，可预测性是一切的基础——如果你把模型的输出传给下一个工具，但格式对不上，整个链路就断了。

**4. 给出例子。** 如果输出格式复杂，给一个示例比用文字描述十句更有效。模型"看懂"一个例子，比"读懂"一段格式规范更快。

**5. 告诉它"做什么"，而不是"不做什么"。** "别写注释"的效果远不如"只在不直观的逻辑处加注释"。"不要啰嗦"远不如"每条回复不超过三句话"。正向指令比负向禁制更精准——因为模型在正向约束下仍需做出选择，而在否定约束下只是避开了一个方向（还有无数其他方向可以跑偏）。

---

### Few-shot：用例子教会模型

Few-shot Prompting 是最简单也最有效的提示词技巧之一。原理：在 Prompt 中给出几个**输入→输出**的示例，让模型通过"类比"来领会你的期望。

假设你在做一个客服 Agent，需要它把用户的情绪化投诉提炼为简洁的问题摘要：

\`\`\`
## 任务：将用户消息提炼为一句话问题摘要

示例 1:
用户: "你们这个 App 真的垃圾，我付了钱会员功能用不了，退钱！"
摘要: 用户付费后会员功能无法使用，要求退款。

示例 2:
用户: "为什么我明明勾了自动续费，结果过期了还要我重新买？坑钱是吧？"
摘要: 用户开启了自动续费但未生效，会员已过期需重新购买。

现在请处理：
用户: "我上传了三次身份证都说格式不对，你们的提示也不说清楚到底什么格式，这是故意的吗？"
摘要:
\`\`\`

模型看了前面两个例子，已经学会了"去掉情绪→提取事实→一句话概括"的模式。第三个输入它自然按同样的方式输出——不需要你解释规则。

Few-shot 的关键在于**例子的质量**，而不是数量：
- 例子要覆盖你想要的各种输出模式
- 例子之间要有差异（如果三个例子都是同一类问题，模型学到的模式会很窄）
- 2-4 个例子通常是最优区间。再多不会提升质量，反而消耗上下文窗口

---

### Chain-of-Thought：让模型"想"了再回答

有时候不是你 Prompt 写得不好，而是问题本身需要多步推理。Chain-of-Thought（CoT，思维链）就是让模型在给出最终答案之前，先把自己的推理过程写出来。

不谈理论，直接看效果。还是代码审查的场景：

**不用 CoT：**

> "下面这段代码有什么问题？"

**用 CoT：**

> "审查下面这段代码。请按以下步骤逐项分析：
> 1. 先理解这段代码要做什么
> 2. 检查输入边界（空值、异常类型、数据范围）
> 3. 检查错误处理是否完整
> 4. 检查是否有性能隐患（不必要的循环、重复计算）
> 5. 综合以上，给出结论和修复建议"

CoT 版本得到的审查质量要高出一个档位——不是模型变聪明了，而是你**把思考过程显式化了**。模型不再是在"猜答案"，而是在执行一个思考流程。

**CoT 在 Agent 系统中是必备技巧。** 因为 Agent 不是单轮问答——它要规划、要执行、要观察结果、要纠正。每一步的 Prompt 如果不包含推理步骤，Agent 就容易跳过关键判断直接输出结论。一个没有 CoT 的 Agent 就像一个不写草稿直接答题的学生——不是不会做，而是容易粗心。

---

### System Prompt：Agent 的宪法

System Prompt 是整个 Agent 系统中最重要的那段提示词——它在对话开始前就被注入，贯穿整个会话，定义 Agent 的**行为边界**和**工作方式**。

一个 Agent 的 System Prompt 通常回答四个问题：

**我是谁？** ——角色定义
\`\`\`
你是 Claude Code，Anthropic 发布的命令行 AI 编程助手。你在用户的终端中运行，能读写文件、执行命令、搜索代码。
\`\`\`

**我能做什么，不能做什么？** ——能力边界
\`\`\`
你可以修改文件，但以下操作需要用户明确确认：
- 删除文件或目录
- 执行破坏性 git 命令（如 reset --hard、force push）
- 修改配置文件（.env、数据库连接等）
\`\`\`

**我该怎么做？** ——工作规范
\`\`\`
写代码时：
1. 禁止在代码中使用 emoji
2. 除非逻辑不直观，否则不要写注释
3. 优先编辑已有文件，避免创建新文件
4. 改 Bug 时只修 Bug，不要顺手重构
\`\`\`

**我输出什么？** ——格式要求
\`\`\`
每次回复控制在三段以内。代码修改后，用一句话说明改了什么。
\`\`\`

这四个问题的答案拼起来，就是 System Prompt。它不需要很长——事实上，越精炼越好——但四个维度都要覆盖。缺了能力边界，Agent 可能越权操作；缺了工作规范，Agent 的行为就不可预测。

![Claude Code 中 System Prompt 的配置位置或配置文件截图](/images/prompt-system.png)

> 📷 **截图说明**：展示 Claude Code 的 CLAUDE.md 或 AGENTS.md 文件内容，或 System Prompt 配置的界面/文件截图，让读者看到实际长什么样。

---

### Prompt 模板与变量化

在 Agent 系统中，很多 Prompt 是**可复用**的——处理不同输入，但流程相同。这类 Prompt 应该模板化。

举个实际的例子。你的 Agent 有一个"搜索互联网信息并总结"的工具，每次调用前需要生成搜索关键词。Prompt 模板可能是这样：

\`\`\`typescript
const SEARCH_KEYWORD_PROMPT = \`
你是一个搜索策略助手。根据用户的问题，生成 3 个最优的搜索关键词。

规则：
- 关键词要具体，不要泛化
- 每个关键词用不同角度（不同措辞、不同语言、不同粒度）
- 优先使用英文关键词（搜索结果更多）
- 只输出关键词，一行一个，不要解释

用户问题：{{userQuestion}}

搜索关键词：
\`;
\`\`\`

\`{{userQuestion}}\` 就是变量。每次调用时替换为实际值。模板化的好处：

- **一致性**：同一类任务，每次 Prompt 结构相同，模型行为可预测
- **可维护**：要调整规则？改模板就好了，不需要在所有调用的地方改
- **可测试**：模板 = 固定部分 + 变量部分，可以单独对模板做 A/B 测试

在 Claude Code 中，Skill 文件本质上就是"模板化了的工作流 Prompt"。一个 Skill 的 Markdown 文件 = 角色定义 + 工作步骤 + 输出格式 + 示例——正是我们前面讲的所有元素的组合。

---

### 调 Prompt 的正确姿势

很多人调 Prompt 的方式是：改一句话 → 跑一次 → 看结果 → 不满意 → 再改一句。这不是调，这是**随机试错**。

正确的调 Prompt 方式，跟调代码一样需要**系统性**：

1. **先建立一个测试集。** 准备 5-10 个真实场景的输入，涵盖正常、边界、异常情况。如果没有测试集，你永远不知道"改了一句 Prompt"到底是变好了还是只在你当前测试的那一个例子上变好了。

2. **一次只改一个变量。** 改了角色定义又改输出格式又加了示例——效果好你也不知道是哪个改动的功劳，效果差你也不知道是哪个改动的锅。

3. **量化评估。** 如果可能，给输出打分。"输出格式正确率"、"关键信息覆盖率"、"错误率"——有数字才有对比，有对比才有优化方向。在 Agent 系统中，这个评估可以部分自动化——让另一个模型给当前模型的输出打分。

4. **迭代到收益递减。** 第一轮优化通常效果显著（比如从 60 分到 80 分），第二轮可能涨到 85 分，第三轮可能只有 86 分。当你发现改了几轮几乎没变化时，说明 Prompt 已经接近这个模型的边界了——这时候该考虑换模型、加工具、或者加数据，而不是继续跟 Prompt 死磕。

---

### 提示词工程的边界：什么不是 Prompt 能解决的

最后说一个容易被忽略但非常重要的事实：**不是所有问题都能靠 Prompt 解决。**

| 问题类型 | Prompt 能解决吗？ | 替代方案 |
|---|---|---|
| 输出格式不统一 | 能 | 加格式约束 + 示例 |
| 回答太啰嗦 | 能 | 加长度限制 |
| 模型不知道某个领域的知识 | 部分能 | 把必要知识直接写在 Prompt 里 |
| 模型产生幻觉 | 部分能 | 加"如有不确定请说明" + 工具验证 |
| 模型推理能力不足 | **不能** | 换更强的模型 |
| 需要访问外部数据 | **不能** | 用 RAG 或 Function Calling |
| 上下文太长模型"忘了" | **不能** | 优化上下文管理策略 |

Prompt Engineering 是一门手艺，但它不是银弹。知道它能力的边界——什么时候该继续调，什么时候该换方案——比掌握所有技巧更重要。

---

### 接下来

这一章我们把 Prompt 从"随便写写"变成了"有方法可循的设计"。这些技巧贯穿后面所有 Agent 开发——写 System Prompt、给工具定义 description、给 Agent 制定行为规则，本质上都是 Prompt Engineering。

下一章，我们进入**API 使用入门**——从"跟聊天框对话"到"用代码调用大模型"，真正开始写 Agent 的第一行代码。`
);

insertArticle.run(
  "api-usage",
  "API 使用入门",
  ch2Id,
  5,
  `## API 使用入门

内容正在编写中，敬请期待。

本章将涵盖：

- Anthropic API 基础调用
- OpenAI API 兼容模式
- 流式输出与响应处理
- 错误处理与重试策略
- Token 用量监控与成本控制`
);

insertArticle.run(
  "function-calling",
  "Function Calling 原理与实践",
  ch2Id,
  6,
  `## Function Calling 原理与实践

内容正在编写中，敬请期待。

本章将涵盖：

- Function Calling 的工作原理
- 定义工具函数
- 解析与执行策略
- 多轮调用与错误恢复`
);

insertArticle.run(
  "tool-use",
  "Tool Use 实战",
  ch2Id,
  7,
  `## Tool Use 实战

内容正在编写中，敬请期待。

本章将涵盖：

- Tool Use 与 Function Calling 的区别
- 工具选择策略
- 并发工具调用
- 工具结果处理与上下文管理`
);

insertArticle.run(
  "mcp-protocol",
  "MCP 协议详解",
  ch2Id,
  8,
  `## MCP 协议详解

内容正在编写中，敬请期待。

本章将涵盖：

- MCP 协议概述
- 客户端与服务端架构
- Tools、Resources、Prompts 三大原语
- 构建自定义 MCP Server`
);

// ========== 工程篇 ==========
insertArticle.run(
  "agent-architecture",
  "Agent 架构设计",
  ch3Id,
  1,
  `## Agent 架构设计

内容正在编写中，敬请期待。

本章将涵盖：

- Agent 的核心架构模式
- 单 Agent vs 多 Agent 系统
- 任务规划与分解
- 错误处理与重试机制`
);

insertArticle.run(
  "memory-system",
  "记忆系统设计",
  ch3Id,
  2,
  `## 记忆系统设计

内容正在编写中，敬请期待。

本章将涵盖：

- 短期记忆与长期记忆
- 向量数据库选型
- 上下文窗口管理
- 记忆的检索与更新策略`
);

insertArticle.run(
  "rag",
  "RAG 检索增强生成",
  ch3Id,
  3,
  `## RAG 检索增强生成

内容正在编写中，敬请期待。

本章将涵盖：

- RAG 的工作原理
- 文档分块与索引
- 检索策略优化
- RAG 与 Agent 的集成`
);

// ========== 实战篇 ==========
insertArticle.run(
  "build-first-agent",
  "构建你的第一个 Agent",
  ch4Id,
  1,
  `## 构建你的第一个 Agent

内容正在编写中，敬请期待。

本章将通过一个完整的实战项目，带你从头构建一个可用的 AI Agent。`
);

insertArticle.run(
  "deploy-to-public",
  "构建公网网站",
  ch4Id,
  2,
  `## 构建公网网站

你已经把 AI Agent 教程网站写好了，本地跑得漂漂亮亮——但它还待在 \`localhost:3000\`，只有你自己能看到。

**这一篇的目标：让你的网站在任何地方都能打开。**

我们会做这几件事：买服务器 → 注册域名 → 部署项目 → 配置 HTTPS。不用担心复杂，每一步都踩过了，跟着走就不会翻车。

---

### 整体架构一览

先搞清楚最终长什么样：

\`\`\`
用户浏览器 → https://你的域名
                    ↓
              Cloudflare（DNS 解析 + CDN + DDoS 防护）
                    ↓
              阿里云 ECS（云服务器）
              ├── Nginx（端口 80/443，反向代理）
              └── Docker 容器（Next.js 在 3000 端口）
                      └── SQLite（数据持久化在宿主机目录）
\`\`\`

不打哑谜：**Cloudflare** 在最前面，负责把域名指向你的服务器 IP，同时提供免费的 CDN 加速和 DDoS 防护。**Nginx** 是门童，站在服务器大门口接待 HTTP/HTTPS 请求，再转发给藏在里面的 Next.js 应用。**Docker** 负责把应用和依赖打包在一起，换个服务器也能跑，不用重新装环境。

---

### 第一步：购买云服务器 ECS

打开阿里云，搜索"云服务器 ECS"。

![阿里云ECS购买页面](/images/aliyun-ecs-buy.png)

关键选择：

- **实例规格**：选「e实例」（共享标准型），2 核 2G 足够跑一个个人网站
- **地域**：哪里离你和你的用户近就选哪。国内用户选华东或华北
- **系统镜像**：选 **Alibaba Cloud Linux 3**（或者 Ubuntu 22.04，看个人习惯）
- **网络**：默认分配公网 IP

买完后，进入控制台 → 云服务器 ECS，你会看到：

![阿里云控制台ECS概览](/images/aliyun-ecs-overview.png)

记住这里三件事：

1. **重置密码**：点击"重置密码"，设置 root 用户的登录密码
2. **公网 IP**：记下这个 IP，后面反复用到
3. **安全组**：马上进入下一步，不开放端口的话外面根本访问不了

---

### 第二步：安全组开放端口

新买的 ECS 默认只开了一个 SSH 端口（22），HTTP 和 HTTPS 都不通。

在 ECS 控制台左边找到"安全组" → 点击你的安全组 → "入方向" → "添加规则"：

![安全组规则配置](/images/aliyun-security-group.png)

添加两条规则：

| 端口 | 协议 | 来源 | 用途 |
|------|------|------|------|
| 80 | TCP | 0.0.0.0/0 | HTTP 访问 |
| 443 | TCP | 0.0.0.0/0 | HTTPS 访问 |

**\`0.0.0.0/0\`** 表示允许全世界访问——一个公网网站当然要开门迎客。

---

### 第三步：注册域名 + Cloudflare DNS 解析

域名可以在任何地方买——阿里云、腾讯云、Namecheap、GoDaddy 都行。挑一个你喜欢的名字，.com 贵一点，.asia / .site / .xyz 便宜不少，个人项目够用了。

域名买好之后，我们不用注册商自带的 DNS 管理，而是把它交给 **Cloudflare**——全球最大的免费 DNS 和 CDN 服务商。为什么用 Cloudflare？三个理由：

1. **免费 CDN 加速**——你的网站自动缓存到 Cloudflare 全球节点，国内外访问都快
2. **免费 DDoS 防护**——不用担心被人打
3. **DNS 生效极快**——改记录通常几分钟就全球生效，不像有些注册商要等几小时

#### Step 1：注册 Cloudflare 并添加域名

打开 [cloudflare.com](https://www.cloudflare.com)，注册一个账号（免费）。登录后，点击右上角的 "Add a domain"（添加站点），输入你刚才买的域名。

![Cloudflare 添加站点页面](/images/cloudflare-add-site.png)

> 📷 **截图说明**：Cloudflare 的 "Add a domain" 页面，输入框中有你的域名。

Cloudflare 会扫描你域名当前的 DNS 记录（可能为空），然后给你两个 **Nameserver（域名服务器）地址**，类似：

\`\`\`
iris.ns.cloudflare.com
matt.ns.cloudflare.com
\`\`\`

**把这两个地址复制下来。**

#### Step 2：修改域名的 Nameserver

回到你买域名的地方（阿里云/腾讯云/Namecheap 等），找到域名管理 → DNS 管理 → **修改 DNS 服务器 / 修改 Nameserver**，把原来的域名服务器替换为 Cloudflare 给的那两个地址。

> 不同注册商的入口名字不一样——有的叫"DNS 修改"，有的叫"Nameserver 修改"，有的叫"自定义 DNS"。反正找到能填服务器地址的地方就对了。

修改之后，回到 Cloudflare 页面，点 "Done, check nameservers"。Cloudflare 会开始检查 Nameserver 是否生效——这通常需要几分钟到几十分钟不等。Cloudflare 会在生效后给你发邮件通知。

#### Step 3：添加 DNS 解析记录

Nameserver 生效后（Cloudflare 状态显示 "Active"），进入 Cloudflare 控制台 → 点击你的域名 → 左侧菜单选 **DNS** → **Records**。

点击 "Add record"，添加一条 A 记录：

![Cloudflare DNS 添加 A 记录](/images/cloudflare-dns-a-record.png)

> 📷 **截图说明**：Cloudflare DNS Records 页面，正在添加 A 记录的表单。

| 字段 | 值 |
|------|-----|
| Type | A |
| Name | @（代表根域名） |
| IPv4 address | 你的 ECS 公网 IP |
| Proxy status | **DNS only**（先关掉代理，灰云图标） |

> **为什么先关掉代理（灰色云）？** 因为后面我们要用 certbot 申请 SSL 证书，certbot 需要直接访问你的服务器验证域名所有权。Cloudflare 的代理（橙色云）会拦截这个验证请求导致失败。等 SSL 证书拿到手之后，再把灰云切回橙云——后面会讲。

TTL 保持默认（Auto）即可，点击 Save。几秒钟后 DNS 就生效了——Cloudflare 的 DNS 是全球最快的之一。

---

### 第四步：用 FinalShell 连上服务器

我们需要一个 SSH 客户端远程操作服务器。

去 [hostbuf.com](https://www.hostbuf.com/) 下载 FinalShell。装好之后：

![FinalShell SSH连接配置](/images/finalshell-ssh-config.png)

点击左上角的文件夹图标 → 新建 SSH 连接：

| 字段 | 值 |
|------|-----|
| 名称 | 随便填，比如"教程服务器" |
| 主机 | 你的公网 IP |
| 用户名 | root |
| 密码 | 之前重置的那个密码 |

点击确定，双击连接。看到命令行提示符 \`[root@xxx ~]#\` 就是连上了。

---

### 第五步：安装 Docker

Docker 把应用和所有依赖打包成一个镜像，免去了在服务器上手动装 Node.js、npm 依赖的麻烦。

在 FinalShell 终端里执行：

\`\`\`bash
# 添加 Docker 镜像源（阿里云镜像，国内快很多）
dnf config-manager --add-repo=https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装 Docker 和 Docker Compose
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动并设置开机自启
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker compose version
\`\`\`

> **为什么要用阿里云镜像？** Docker 官方源在国内下载极慢甚至超时，换成阿里云的镜像源稳定很多。

配置 Docker 镜像加速（解决 Docker Hub 拉取慢的问题）：

\`\`\`bash
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": ["https://docker.m.daocloud.io"]
}
EOF
systemctl restart docker
\`\`\`

---

### 第六步：安装 Nginx

Nginx 负责在最外层接收 HTTP/HTTPS 请求并转发给后端应用：

\`\`\`bash
dnf install -y nginx
systemctl start nginx
systemctl enable nginx
\`\`\`

---

### 第七步：把你的项目传上服务器

回到本地电脑，确保项目根目录有这四个文件（如果没有，现在创建）：

**Dockerfile** — 定义如何构建 Docker 镜像：

\`\`\`dockerfile
FROM node:22-alpine AS builder
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache python3 make g++ sqlite-dev
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache sqlite-dev
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/db ./db
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
RUN chmod +x entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
\`\`\`

**docker-compose.yml** — 一键启动容器：

\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - db_data:/app/db
    restart: unless-stopped

volumes:
  db_data:
\`\`\`

**.dockerignore** — 排除不需要的东西：

\`\`\`
node_modules
.next
.git
.env.local
\`\`\`

**entrypoint.sh** — 首次运行自动初始化数据库：

\`\`\`bash
#!/bin/sh
set -e
if [ ! -f /app/db/data.db ]; then
  echo "Database not found, seeding..."
  npx tsx /app/db/seed.ts
fi
echo "Starting Next.js..."
exec npm start
\`\`\`

然后把项目传到服务器。可以用 Git clone，也可以直接打包上传：

\`\`\`bash
# 在本地项目目录打包
tar --exclude='node_modules' --exclude='.next' --exclude='.git' -czf project.tar.gz .
# 用 FinalShell 的文件传输功能，或者 scp 上传
scp project.tar.gz root@你的IP:/opt/
# 在服务器上解压
ssh root@你的IP
mkdir -p /opt/my-website
tar -xzf /opt/project.tar.gz -C /opt/my-website/
rm /opt/project.tar.gz
\`\`\`

---

### 第八步：构建并启动

\`\`\`bash
cd /opt/my-website
docker compose build   # 构建镜像（第一次比较慢，耐心等几分钟）
docker compose up -d   # 后台启动容器
\`\`\`

验证一下：

\`\`\`bash
curl http://localhost:3000
# 应该看到首页 HTML
\`\`\`

---

### 第九步：配置 Nginx 反向代理

现在你的应用跑在 \`localhost:3000\`，但用户从外面访问的是你的域名，走的是 80 端口。需要 Nginx 把请求转发过去：

\`\`\`bash
cat > /etc/nginx/conf.d/my-website.conf << 'EOF'
server {
    listen 80;
    server_name 你的域名;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

nginx -t            # 检查配置
systemctl reload nginx
\`\`\`

---

### 第十步：申请 SSL 证书（HTTPS）

HTTP 的锁是开着的，HTTPS 才安全。用 Let's Encrypt 免费证书：

\`\`\`bash
dnf install -y certbot python3-certbot-nginx
certbot --nginx -d 你的域名
\`\`\`

按提示输入邮箱，同意协议。certbot 会自动修改 Nginx 配置，加上 SSL 并设置自动续期。

> 如果 certbot 报 DNS 解析失败，说明 DNS 还没生效。等几分钟再试。

证书到手后，回到 **Cloudflare DNS 设置页面**，把你域名的 A 记录旁边的灰色云图标点一下，切换为**橙色云（Proxied）**。

\`\`\`
灰色云 = DNS only（关闭代理，裸奔）→ 用于申请证书时
橙色云 = Proxied（开启代理，CDN + 防护）→ 正常运行时
\`\`\`

切到橙云之后，Cloudflare 会为你的域名自动提供 SSL 证书（用户 ↔ Cloudflare 这一段），加上你服务器上的 certbot 证书（Cloudflare ↔ 服务器这一段），整条链路都是加密的。去 Cloudflare 的 **SSL/TLS** 设置页面，把加密模式设为 **"Full (strict)"**——这样 Cloudflare 会验证你服务器上的证书是否有效，安全性最高。

---

### 打开浏览器，验收成果

输入你的域名，看到熟悉的页面了吗？

![网站成功上线](/images/website-live.png)

从 \`localhost:3000\` 到一个公网可访问的 HTTPS 网站，走完了。

> **我们踩过的坑：**
> - Docker 官方源在国内超时 → 换阿里云镜像
> - Alpine apk 下载慢 → 换阿里云 Alpine 源
> - npm 安装慢 → 换 npmmirror
> - Next.js 构建时拉 Google Fonts 失败 → 把 Geist 换成系统字体
> - DNS 不生效 → 检查 Cloudflare 的 Nameserver 是否在注册商处改对了
> - certbot 验证失败 → 检查 Cloudflare 代理是否已切为灰色云（DNS only）
> - 安全组不开放端口 → 外网访问不了

这些坑都替你踩过了，按这篇教程走不会出问题。

---

### 小结

你学会了：

1. 从零买一台云服务器，开通公网访问
2. 用 Docker 把 Next.js 项目容器化
3. 用 Nginx 做反向代理，接管 HTTP/HTTPS 请求
4. 用 certbot 白嫖 SSL 证书

整个过程看起来不少，但实际敲命令的时间不超过 30 分钟。**最花时间的是等 DNS 生效。**

有了这台服务器，后面所有实战项目都能直接往上部署。这不是一个本地实验环境了——**你有一个真实的、公网可访问的网站。**`
);

console.log("Seed data created successfully!");
