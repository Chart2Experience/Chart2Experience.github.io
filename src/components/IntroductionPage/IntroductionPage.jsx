import { React, useEffect } from "react";
import "./IntroductionPage.scss";

const IntroductionPage = () => {
  return (
    <div className="introduction-page">
      <div className="introduction">
        <h2>Overview</h2>
        <p>This page provides supplementary materials of the paper and interactive plots for data exploration.</p>
      </div>
      <div className="abstract">
        <h2>Abstract of the Paper</h2>
        <p>The field of Multimodal Large Language Models (MLLMs) has made remarkable progress in visual understanding tasks, presenting a vast opportunity to predict the perceptual and emotional impact of charts. However, it also raises concerns, as many applications of LLMs are based on overgeneralized assumptions from a few examples, lacking sufficient validation of their performance and effectiveness. We introduce Chart-to-Experience, a dataset comprising 36 charts, each evaluated by 36 crowdsourced workers who rated seven emotion and perception factors, resulting in a total of 9,072 data points. Using this dataset as ground truth, we demonstrate capabilities of state-of-the-art MLLMs to predict Likert scores for each chart, and to determine relative preference when comparing two charts regarding the factors. Results show that the predicted scores are positively correlated with the ground truth, for Aesthetic Pleasure and Intuitiveness. In addition, some models achieved over 90% accuracy in pairwise comparisons between two charts. However, some of the models show a tendency to generate overly optimistic results and to overrate specific visual features differ from crowdsourced workers.</p>
      </div>

      <div className="data-files">
        <h2>Data Files</h2>
        <p>You can download data files here.</p>
        <table>
          <tr>
            <td>Task 1 - <a href="/data/240826_total_1296_0.csv" download>Human</a></td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Task 1 - <a href="/data/scores_GPT4o_36.csv" download>GPT-4o</a></td>
            <td>&nbsp;Task 2 - <a href="/data/accuracy_GPT4o.csv" download>GPT-4o</a></td>
          </tr>
          <tr>
            <td>Task 1 - <a href="/data/scores_llama_216.csv" download>Llama-3.2-Vision-Instruct</a></td>
            <td>&nbsp;Task 2 - <a href="/data/accuracy_llama.csv" download>Llama-3.2-Vision-Instruct</a></td>
          </tr>
          <tr>
            <td>Task 1 - <a href="/data/scores_sonnet_36_1.csv" download>Claude 3.5 Sonnet</a></td>
            <td>&nbsp;Task 2 - <a href="/data/accuracy_sonnet_1.csv" download>Claude 3.5 Sonnet</a></td>
          </tr>
        </table>
      </div>

      <div className="prompts">
        <h2>Prompt Examples</h2>
        <h3>Task 1: Score Prediction</h3>
        Before prompting MLLMs to score using the Likert scale (Task 1), to prevent them from generating repetitive results for the same chart and to ensure that there is no significant disparity with the actual crowdsourced study environment, we created 216 virtual different personas.
        <div className="prompt-box">
          <div className="prompt-box-title">Prompt for Generating 216 Different Personas</div>
          <div className="prompt-box-text">
            Given that we recruited <b>[</b>Number of Previously Generated Personas<b>]</b>  persons of <b>[</b>Previously Generated Personas<b>]</b>.<br/>
            Please imagine 12 additional persons with distinct persona who would read the web article.<br/>
            Please fill their specifications in one sentence inside of someone-index tags like following format tags one by one.<br/>
            &lt;someone-index&gt;&lt;/someone-index&gt;<br/>
            please note that the index starts from 0 and index is in range of (0, 12) for corresponding person.<br/>
            please make output with only tags and their contents.
          </div>
        </div>
        <div className="prompt-box">
          <div className="prompt-box-title">Persona Examples (N=10)</div>
          <div className="prompt-box-text">
            Persona 0: A tech-savvy college student majoring in computer science who is always on the lookout for the latest gadgets and software updates.<br/>
            Persona 1: A middle-aged marketing executive who relies heavily on digital tools for work but struggles to keep up with rapidly changing technology.<br/>
            Persona 2: A retired elementary school teacher who is curious about technology but often feels overwhelmed by its complexity.<br/>
            Persona 3: A young entrepreneur running a startup, constantly seeking innovative ways to leverage technology for business growth.<br/>
            Persona 4: A stay-at-home parent who uses technology primarily for managing household tasks and keeping in touch with family.<br/>
            Persona 5: A high school student who is a gaming enthusiast and aspiring game developer, always eager to learn about new gaming technologies.<br/>
            Persona 6: A freelance graphic designer who depends on various software and hardware to create cutting-edge designs for clients.<br/>
            Persona 7: A medical professional interested in how technology can improve patient care and streamline healthcare processes.<br/>
            Persona 8: A small business owner looking to understand how technology can help expand their online presence and improve customer service.<br/>
            Persona 9: A social media influencer constantly exploring new platforms and features to engage with their growing audience.<br/>
          </div>
        </div>
        Using these generated personas, we iteratively called MLLMs using the prompt below.
        <div className="prompt-box">
          <div className="prompt-box-title">Prompt for the Task 1 (Scoring in Likert Scale)</div>
          <div className="prompt-box-text">
            You are a helpful Data Visualization Expert.<br/>
            For 6 different persons<br/>
            person-<b>[</b>index of the persona-1<b>]</b>: <b>[</b>description of the persona-1<b>]</b><br/>
            person-<b>[</b>index of the persona-2<b>]</b>: <b>[</b>description of the persona-2<b>]</b><br/>
            person-<b>[</b>index of the persona-3<b>]</b>: <b>[</b>description of the persona-3<b>]</b><br/>
            person-<b>[</b>index of the persona-4<b>]</b>: <b>[</b>description of the persona-4<b>]</b><br/>
            person-<b>[</b>index of the persona-5<b>]</b>: <b>[</b>description of the persona-5<b>]</b><br/>
            person-<b>[</b>index of the persona-6<b>]</b>: <b>[</b>description of the persona-6<b>]</b><br/>
            You will be provided with 6 chart images.<br/>
            Also, you will be provided with questions inside the following &lt;questions&gt; tags.<br/>
            &lt;questions&gt;<br/>
            &nbsp;&lt;item key="mem"&gt; The chart is easily remembered. &lt;/item&gt;<br/>
            &nbsp;&lt;item key="int"&gt; The chart is interesting. &lt;/item&gt;<br/>
            &nbsp;&lt;item key="tru"&gt; The chart appears trustworthy. &lt;/item&gt;<br/>
            &nbsp;&lt;item key="emp"&gt; I can empathize with the chart. &lt;/item&gt;<br/>
            &nbsp;&lt;item key="aes"&gt; The chart is aesthetically pleasing. &lt;/item&gt;<br/>
            &nbsp;&lt;item key="itt"&gt; The chart is intuitive. &lt;/item&gt;<br/>
            &nbsp;&lt;item key="cft"&gt; I feel comfortable with the chart. &lt;/item&gt;<br/>
            &lt;/questions&gt;<br/>
            With given information of persons, chart images and questions, you have following tasks to achieve inside &lt;task&gt; tags.<br/>
            &lt;task&gt;<br/>
            &nbsp;&lt;answers&gt;<br/>
              &nbsp;&nbsp;&nbsp;1. Strongly Disagree<br/>
              &nbsp;&nbsp;&nbsp;2. Disagree<br/>
              &nbsp;&nbsp;&nbsp;3. Partially Disagree<br/>
              &nbsp;&nbsp;&nbsp;4. Neutral<br/>
              &nbsp;&nbsp;&nbsp;5. Partially Agree<br/>
              &nbsp;&nbsp;&nbsp;6. Agree<br/>
              &nbsp;&nbsp;&nbsp;7. Strongly Agree<br/>
            &nbsp;&lt;/answers&gt;<br/>
            &nbsp;&nbsp;for all chart images and question items,
            &nbsp;&nbsp;predict the scores which the persons might give for each question following the given score rubrics in &lt;answers&gt; tags.<br/>
            &nbsp;&nbsp;You don't need to provide any interpretations on the chart.<br/>
            &nbsp;&nbsp;Instead, please provide only the summary of your scores using JSON format like the following structure.<br/>
            &nbsp;&nbsp;&#123;<br/>
              &nbsp;&nbsp;&nbsp;"<b>[</b>Name of the chart-1<b>]</b>": &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-1<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-2<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-6<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
              &nbsp;&nbsp;&nbsp;&#125;,<br/>
              &nbsp;&nbsp;&nbsp;"<b>[</b>Name of the chart-2<b>]</b>": &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-1<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-2<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-6<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
              &nbsp;&nbsp;&nbsp;&#125;,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<br/>
              &nbsp;&nbsp;&nbsp;"<b>[</b>Name of the chart-6<b>]</b>": &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-1<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-2<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"persona_<b>[</b>index of the persona-6<b>]</b>": &#123;"mem": , "int": , "tru": , "emp": , "aes": , "itt": , "cft": &#125;,<br/>
              &nbsp;&nbsp;&nbsp;&#125;<br/>
            &nbsp;&#125;<br/>
            &lt;/task&gt;<br/>
          </div>
        </div>
        <br/>
        <h3>Task 2: Predicting Preferable Chart Between Two</h3>
        Here is an example prompt for pairwise comparison (Task 2). Unlike Task 1, data was obtained through a single prompting. Thus, we explicitly mention “ordinary persons” in the prompt in order to avoid bias toward any specific persona.<br/>
        The question sentences used for each experiential factor in the prompt are as follows:
        <ul>
          <li>Memorability: "The chart is easily remembered."</li>
          <li>Interest: "The chart is interesting."</li>
          <li>Trustworthiness: "The chart appears trustworthy."</li>
          <li>Empathy: "I can empathize with the chart."</li>
          <li>Aesthetic Pleasure: "The chart is aesthetically pleasing."</li>
          <li>Intuitiveness: "The chart is intuitive."</li>
          <li>Comfort: "I feel comfortable with the chart."</li>
        </ul>
        <div className="prompt-box">
          <div className="prompt-box-title">Prompt for the Task 2 (Pairwise Comparison)</div>
          <div className="prompt-box-text">
          You are a helpful Data Visualization Expert.<br/>
          You will be provided two charts.<br/>
          You will predict which chart would receive higher score from ordinary persons with the question `<b>[</b>Question sentence<b>]</b>'.<br/>
          Then, please answer with following scenarios.<br/>
          &nbsp;1) if the first chart got higher average score, write '&lt;result&gt;<b>[</b>Name of the chart-1<b>]</b>&lt;/result&gt;',<br/>
          &nbsp;2) else if the second chart got higher average score, write '&lt;result&gt;<b>[</b>Name of the chart-2<b>]</b>&lt;/result&gt;',<br/>
          also, describe why you think so using less than 50 words inside &lt;reason&gt; tags.<br/>
          The name of the first chart is <b>[</b>Name of the chart-1<b>]</b>.<br/>
          The name of the second chart is <b>[</b>Name of the chart-2<b>]</b>.<br/>
          </div>
        </div>
      </div>
    </div>

    // Prompt Images

  );
};

export default IntroductionPage;
