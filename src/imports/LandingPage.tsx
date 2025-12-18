import svgPaths from "./svg-6sovak61ez";
import imgAdobeExpressFile31 from "figma:asset/7ba16f5335969b66c314f7955ee4897ab548acd6.png";

function Frame4() {
  return (
    <div className="box-border content-stretch flex flex-row font-['Poppins:Regular',_sans-serif] gap-12 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#f8f7f9] text-[18px] text-left text-nowrap w-[598px]">
      <div className="relative shrink-0">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Home
        </p>
      </div>
      <button className="[white-space-collapse:collapse] block cursor-pointer relative shrink-0">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          About me
        </p>
      </button>
      <button className="[white-space-collapse:collapse] block cursor-pointer relative shrink-0">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Projects
        </p>
      </button>
      <button className="[white-space-collapse:collapse] block cursor-pointer relative shrink-0">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          certification
        </p>
      </button>
      <button className="[white-space-collapse:collapse] block cursor-pointer relative shrink-0">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Contacts
        </p>
      </button>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-11 relative shrink-0 w-5">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 44"
      >
        <g id="Frame 5">
          <line
            id="Line 1"
            stroke="var(--stroke-0, #F8F7F9)"
            x1="10.5"
            x2="10.5"
            y1="10"
            y2="34"
          />
        </g>
      </svg>
    </div>
  );
}

function Instagram() {
  return (
    <div className="relative shrink-0 size-6" data-name="instagram">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="instagram">
          <path
            d={svgPaths.p4fdb300}
            id="Vector"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p39557800}
            id="Vector_2"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M17.5 6.5H17.51"
            id="Vector_3"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Twitter() {
  return (
    <div className="relative shrink-0 size-6" data-name="twitter">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="twitter">
          <path
            d={svgPaths.p3350a500}
            id="Vector"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0">
      <Instagram />
      <Twitter />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute box-border content-stretch flex flex-row gap-6 items-center justify-start left-[678px] p-0 top-7 w-[740px]">
      <Frame4 />
      <Frame5 />
      <Frame3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-start justify-start p-[10px] relative shrink-0">
      <div className="font-['Poppins:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#f8f7f9] text-[24px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">{`HI, I’M NEERAJ `}</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 h-[210px] items-start justify-start p-[10px] relative shrink-0 w-[758px]">
      <div className="font-['Poppins:Bold',_sans-serif] h-[200px] leading-[96px] not-italic relative shrink-0 text-[#f8f7f9] text-[96px] text-left w-[740px]">
        <p className="block mb-0">I’M A PRODUCT</p>
        <p className="block">{`MANAGER `}</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0">
      <Frame8 />
      <Frame7 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <button className="box-border content-stretch cursor-pointer flex flex-row gap-2.5 items-start justify-start overflow-visible px-8 py-4 relative rounded-2xl shrink-0">
      <div className="absolute border-2 border-[#f8f7f9] border-solid inset-0 pointer-events-none rounded-2xl" />
      <div className="font-['Poppins:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#f8f7f9] text-[24px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">{` VIEW MY PROJECTS`}</p>
      </div>
    </button>
  );
}

function Frame13() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-8 items-start justify-start left-[83px] p-0 top-64">
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Frame9() {
  return (
    <div
      className="absolute h-[338px] translate-x-[-50%] translate-y-[-50%] w-[970px]"
      style={{ top: "calc(50% - 2206px)", left: "calc(50% - 96px)" }}
    >
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function VuesaxLinearEye() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/eye">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="eye">
          <path
            d={svgPaths.p22fd0900}
            id="Vector"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p35131980}
            id="Vector_2"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Eye2() {
  return (
    <div
      className="absolute bottom-[40.795%] left-[65.486%] right-[33.264%] top-[59.017%]"
      data-name="eye"
    >
      <VuesaxLinearEye />
    </div>
  );
}

function VuesaxLinearEye1() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/eye">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="eye">
          <path
            d={svgPaths.p22fd0900}
            id="Vector"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p35131980}
            id="Vector_2"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Eye5() {
  return (
    <div
      className="absolute bottom-[39.683%] left-[65.486%] right-[33.264%] top-[60.128%]"
      data-name="eye"
    >
      <VuesaxLinearEye1 />
    </div>
  );
}

function VuesaxLinearEye2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/eye">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="eye">
          <path
            d={svgPaths.p22fd0900}
            id="Vector"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p35131980}
            id="Vector_2"
            stroke="var(--stroke-0, #F8F7F9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Eye8() {
  return (
    <div
      className="absolute bottom-[38.53%] left-[65.486%] right-[33.264%] top-[61.281%]"
      data-name="eye"
    >
      <VuesaxLinearEye2 />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[#1f1f1f] relative size-full" data-name="Landing Page">
      <div className="absolute bottom-[5656px] flex h-[1798.437px] items-center justify-center right-[1369px] w-[0.5px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-[0.504px] relative w-[1798.44px]">
            <div className="absolute bottom-[-893.24%] left-[-0.222%] right-[-0.222%] top-[-893.24%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 1807 10"
              >
                <g filter="url(#filter0_f_1_335)" id="Line 2" opacity="0.6">
                  <path
                    d="M4 5.50378L1802.44 5"
                    stroke="var(--stroke-0, white)"
                  />
                </g>
                <defs>
                  <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height="9.50378"
                    id="filter0_f_1_335"
                    width="1806.44"
                    x="-0.000140061"
                    y="0.5"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      mode="normal"
                      result="shape"
                    />
                    <feGaussianBlur
                      result="effect1_foregroundBlur_1_335"
                      stdDeviation="2"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[4129.5px] flex h-[1279.937px] items-center justify-center right-[1368.71px] w-[0.766px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-[0.791px] relative w-[1279.94px]">
            <div className="absolute bottom-[-568.611%] left-[-0.313%] right-[-0.313%] top-[-568.611%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 1288 11"
              >
                <g filter="url(#filter0_f_1_323)" id="Line 3" opacity="0.6">
                  <path
                    d="M4 5.7914L1283.94 5"
                    stroke="var(--stroke-0, white)"
                  />
                </g>
                <defs>
                  <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height="9.7914"
                    id="filter0_f_1_323"
                    width="1287.94"
                    x="-0.000309157"
                    y="0.5"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      mode="normal"
                      result="shape"
                    />
                    <feGaussianBlur
                      result="effect1_foregroundBlur_1_323"
                      stdDeviation="2"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[298.406px] items-center justify-center right-[1367.82px] top-[5630.56px] w-[1.656px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-[1.686px] relative w-[298.437px]">
            <div className="absolute bottom-[-266.876%] left-[-1.341%] right-[-1.341%] top-[-266.891%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 307 12"
              >
                <g filter="url(#filter0_f_1_321)" id="Line 4" opacity="0.6">
                  <path
                    d="M4 6.68618L302.437 4.99974"
                    stroke="var(--stroke-0, white)"
                  />
                </g>
                <defs>
                  <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height="10.6864"
                    id="filter0_f_1_321"
                    width="306.442"
                    x="-0.00282541"
                    y="0.499745"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      mode="normal"
                      result="shape"
                    />
                    <feGaussianBlur
                      result="effect1_foregroundBlur_1_321"
                      stdDeviation="2"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[897px] left-[583px] top-[271px] w-[905px]">
        <div className="absolute bottom-[-28.54%] left-[-28.287%] right-[-28.287%] top-[-28.54%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1417 1409"
          >
            <g filter="url(#filter0_f_1_319)" id="Ellipse 1">
              <ellipse
                cx="708.5"
                cy="704.5"
                fill="var(--fill-0, #F8F7F9)"
                fillOpacity="0.1"
                rx="452.5"
                ry="448.5"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="1409"
                id="filter0_f_1_319"
                width="1417"
                x="0"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="shape"
                />
                <feGaussianBlur
                  result="effect1_foregroundBlur_1_319"
                  stdDeviation="128"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Frame6 />
      <Frame13 />
      <div className="absolute font-['Poppins:Bold',_sans-serif] leading-[0] left-[61px] not-italic text-[#f8f7f9] text-[24px] text-left text-nowrap top-[1747px]">
        <p className="block leading-[normal] whitespace-pre">{`EDUCATION `}</p>
      </div>
      <div className="absolute font-['Poppins:Bold',_sans-serif] leading-[0] left-[61px] not-italic text-[#f8f7f9] text-[24px] text-left text-nowrap top-[2019px]">
        <p className="block leading-[normal] whitespace-pre">Experience</p>
      </div>
      <div
        className="absolute bg-center bg-cover bg-no-repeat h-[1320px] left-[745px] top-20 w-[742.5px]"
        data-name="Adobe Express - file (3) 1"
        style={{ backgroundImage: `url('${imgAdobeExpressFile31}')` }}
      />
      <div className="absolute font-['Poppins:Bold',_sans-serif] h-[100px] leading-[0] left-[61px] not-italic text-[#f8f7f9] text-[96px] text-left top-[1218px] w-[715px]">
        <p className="block leading-[96px]">{`About me `}</p>
      </div>
      <div className="absolute font-['Poppins:Bold',_sans-serif] h-[100px] leading-[0] left-[61px] not-italic text-[#f8f7f9] text-[96px] text-left top-[4001px] w-[407px]">
        <p className="block leading-[96px]">Projects</p>
      </div>
      <div className="absolute font-['Poppins:Bold',_sans-serif] h-[81px] leading-[0] left-[61px] not-italic text-[#f8f7f9] text-[96px] text-left top-[5529px] w-[715px]">
        <p className="block leading-[96px]">{`Certifications `}</p>
      </div>
      <div className="absolute font-['Poppins:Bold',_sans-serif] h-[81px] leading-[0] left-[61px] not-italic text-[#f8f7f9] text-[96px] text-left top-[6055px] w-[715px]">
        <p className="block leading-[96px]">{`Contacts `}</p>
      </div>
      <Frame9 />
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[338px] leading-[normal] left-[139px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[1328px] w-[1038px]">
        <p className="block mb-0">{`I'm Dynamic and results-driven Senior Business Development Associate with a robust background in sales, client relations, and Agile product management.`}</p>
        <p className="block">
          I have a proven track record of exceeding targets, driving revenue
          growth, and leading high-performing teams. Experienced in utilizing
          data analytics, market research, and innovative strategies to achieve
          business objectives. Certified Scrum Product Owner (CSPO) with
          advanced expertise in Agile methodologies, product backlog management,
          and sprint planning. Passionate about continuous improvement and
          delivering customer-centric solutions that drive operational
          efficiency and market success.
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[216px] leading-[normal] left-[139px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[1793px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          National Institute of Technology Puducherry
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          I hold a Bachelor of Technology degree in Electronics and
          Communications from National Institute of Technology Puducherry, with
          a cumulative GPA of 5.29/10.0. My education has equipped me with a
          solid foundation in technical skills and problem-solving
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[361px] leading-[normal] left-[139px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[2065px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          PRODUCT MANAGER
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">{`2024 — current `}</p>
        <p className="block font-['Poppins:Medium',_sans-serif] whitespace-pre-wrap">{`As a Product Manager at TRANSOND Systems Private Limited Joint Venture and EOR of  AICTEC India, I bridge the gap between cutting-edge products and customer needs. My responsibilities  include comprehensive market research to identify trends, customer pain points, and opportunities, while  collaborating with cross-functional teams to refine product strategies. I leverage data insights to inform the  product roadmap, prioritizing features that maximize user value and drive business growth. Additionally, I  ensure smooth product launches that enhance functionality and deliver an exceptional user experience.`}</p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[172px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[4111px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          Energic - EV charging station management system
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">{`07/2024 — current `}</p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          Energic provides a comprehensive and user-friendly EV charging station
          management system (CSMS) that helps with Real time locating,
          scheduling, and managing charging stations and maintenance alerts.
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[468px] leading-[normal] left-[139px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[2436px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          SENIOR BUSINESS DEVELOPMENT ASSOCIATE
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">{`2021 — 2022 `}</p>
        <p className="block font-['Poppins:Medium',_sans-serif]">{`As a senior business development associate I established and nurtured relationships with prospective clients, driving business growth and consistently exceeding sales targets. By facilitating virtual presentations via Zoom, I educated clients on product offerings. I developed and executed targeted sales strategies, securing new business opportunities and significantly contributing to revenue growth. Leading a dynamic team of business development associates, I provided mentorship and guidance to ensure high performance. Conducting thorough market research, I identified new markets and customer segments, expanding the academy’s footprint. I fostered strong client relationships, providing tailored solutions that aligned with their career aspirations. I implemented KPIs to optimize processes, collaborated with marketing and product teams, and designed training programs to enhance the team's skills.`}</p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[206px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[4301px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          Product Roadmap for an Online Grocery Delivery Platform
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">{`06/2024 — 07/2024 `}</p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          A 12-month roadmap for an online grocery delivery platform that can
          achieve significant growth, enhance customer satisfaction, and
          establish itself as a market leader. This strategy ensures a balanced
          focus on user experience, operational efficiency, and continuous
          innovation.
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[498px] leading-[0] left-[139px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[2914px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] leading-[normal] mb-0">
          SENIOR ADMISSION COUNSELLOR
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] leading-[normal] mb-0">
          2020 — 202 1
        </p>
        <p className="leading-[normal] whitespace-pre-wrap">
          <span className="font-['Poppins:Medium',_sans-serif]">{`As a senior admission counsellor  established and maintained communication with prospective clients, cultivating strategic partnerships and consistently meeting revenue targets. I provided comprehensive guidance to prospective students on course selection, admission requirements, and career pathways, ensuring informed decisions. Managing the end-to-end admission process, I consistently exceeded enrolment targets. Collaborating with marketing and academic teams, I aligned admission strategies with organizational goals, enhancing program visibility. Utilizing data and analytics, I tracked enrolment trends and implemented strategies to boost conversion rates. I trained and mentored junior `}</span>
          <span className="font-['Poppins:SemiBold',_sans-serif]">
            counsellors
          </span>
          <span className="font-['Poppins:Medium',_sans-serif]">
            , fostering a supportive team environment. I maintained strong
            relationships with prospective students and their families,
            providing ongoing support and improving admission processes for a
            seamless applicant experience.
          </span>
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[169px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[4517px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          IPL Best XI project
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          05/2023- 07/2023
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          A python project to find IPL Best XI by Involving Players from All 10
          Teams of IPL 2023 season, by analysing and understanding the various
          factors that influence team selection and to develop effective
          strategies for selecting IPL Best XI
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[169px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[4696px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          Market Analysis
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          03/2023 — 05/2023
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          A python project to find IPL Best XI by Involving Players from All 10
          Teams of IPL 2023 season, by analysing and understanding the various
          factors that influence team selection and to develop effective
          strategies for selecting IPL Best XI
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[458px] leading-[normal] left-[139px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[3422px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          BUSINESS DEVELOPMENT ASSOCIATE
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">{`2018 — 2019 `}</p>
        <p className="block font-['Poppins:Medium',_sans-serif] whitespace-pre-wrap">{`As a business development associate have  I contacted potential clients to set up meetings and counselled them on learning pedagogies and personalized learning experiences, achieving sales targets consistently. I directed and mentored a team of 10 business development representatives, providing guidance to achieve individual and collective goals. I developed and implemented strategic plans to enhance market penetration and customer acquisition. By identifying and addressing performance gaps, I ensured consistent sales goal achievement and improved overall productivity. Conducting training sessions, I enhanced team members' skills in sales techniques, product knowledge, and customer relationship management. Through thorough market research, I identified new business opportunities and built strong client relationships, providing tailored solutions to ensure satisfaction.`}</p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[171px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[4875px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          Financial Analysis
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          02/2023 — 04/2023
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">{`Analysed the past 5 years financial statements of Jj associates to understand the business's financial health and performance. Identified trends, compared against industry benchmarks, and made recommendations for improvements`}</p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[171px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[5056px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          Conducted User Research
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          02/2023 — 04/2024
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          Performed user research to understand the needs, preferences, and
          behaviours of users. Used the research findings understand, what kind
          of design and feature improvements are expected by users in the next
          generation iPhone line-up.
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[171px] leading-[normal] not-italic right-[1293px] text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[5237px] translate-x-[100%] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          An efficient image authentication based on hamming code
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          07/2016 — 05/2017
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          This presents the emerging technique for image authentication based on
          hamming coding by combining Hamming code technique, Torus
          auto-morphism and bit rotation
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[98px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[5620px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          CERTIFICATION OF BUSINESS CORRESPONDENTS/FACILITATORS
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          2019
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">{`Indian Institute of Banking & Finance`}</p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[98px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[5728px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          CERTIFIED SCRUM PRODUCT OWNER®
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          2024
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          Scrum Alliance®
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[98px] leading-[normal] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[5836px] w-[1038px]">
        <p className="block font-['Poppins:ExtraBold',_sans-serif] mb-0">
          ADVANCE CERTIFIED SCRUM PRODUCT OWNER®
        </p>
        <p className="block font-['Poppins:ExtraLight',_sans-serif] mb-0">
          2024
        </p>
        <p className="block font-['Poppins:Medium',_sans-serif]">
          Scrum Alliance®
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[29px] leading-[0] left-[147px] not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[6146px] w-[445px]">
        <p className="leading-[normal]">
          <span className="font-['Poppins:ExtraBold',_sans-serif]">{`Email - `}</span>
          <span className="font-['Poppins:Medium',_sans-serif]">
            neo.maddison17@gnail.com
          </span>
        </p>
      </div>
      <div className="absolute font-['Poppins:Regular',_sans-serif] h-[29px] leading-[0] left-36 not-italic text-[24px] text-[rgba(248,247,249,0.5)] text-left top-[6185px] w-[445px]">
        <p className="leading-[normal]">
          <span className="font-['Poppins:ExtraBold',_sans-serif]">{`Phone - `}</span>
          <span className="font-['Poppins:Medium',_sans-serif]">
            +916282587126
          </span>
        </p>
      </div>
      <div className="absolute bottom-[7448px] right-[1362px] size-[15px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute bottom-[5402px] right-[1362px] size-[15px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute bottom-[3893px] right-[1361px] size-[15px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[2446px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[4311px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1361px] size-[15px] top-[5738px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1361px] size-[15px] top-[5846px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[2924px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[4527px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[4706px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[3432px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[4885px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[5066px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <div className="absolute right-[1362px] size-[15px] top-[5247px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <circle
            cx="7.5"
            cy="7.5"
            fill="var(--fill-0, #D9D9D9)"
            id="Ellipse 2"
            r="7.5"
          />
        </svg>
      </div>
      <Eye2 />
      <Eye5 />
      <Eye8 />
    </div>
  );
}