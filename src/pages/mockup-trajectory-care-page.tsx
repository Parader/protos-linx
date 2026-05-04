import { useState, type ReactNode } from "react";
import { motion } from "motion/react";

const imgVector = "https://www.figma.com/api/mcp/asset/3707b6eb-7c21-47b4-bebb-a8e2e7f894e1";
const imgAvatar = "https://www.figma.com/api/mcp/asset/33489cbf-8f71-4688-839d-b701f42daf43";
const imgIcon = "https://www.figma.com/api/mcp/asset/d614ebe6-31c2-4081-891d-9d19d53dcfc6";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/7a9b58e1-1185-4d4f-afd3-880e7d30e868";
const imgIcon2 = "https://www.figma.com/api/mcp/asset/a530b9ff-ebd9-4c61-8b78-8ea290772f8d";
const imgIcon3 = "https://www.figma.com/api/mcp/asset/f045876c-9129-41d6-8f42-193ece34d967";
const imgVector1 = "https://www.figma.com/api/mcp/asset/b385a368-4d8b-4745-a0f2-d41f648f5074";
const imgVector2 = "https://www.figma.com/api/mcp/asset/1e50b700-0cd6-47cc-99af-1af0841b5d0e";
const imgDivider = "https://www.figma.com/api/mcp/asset/4d9dc372-861f-43b0-b6b9-7ada0522a4f0";
const imgChevronLeft = "https://www.figma.com/api/mcp/asset/9355e94b-a2b3-4daa-ac6d-e5eb2f363cab";
const imgFrame = "https://www.figma.com/api/mcp/asset/cf5404ec-f6b7-46ff-b710-58937bf30347";
const imgFrame499 = "https://www.figma.com/api/mcp/asset/04be9112-babf-4f5d-9b0c-94d810c1fa9e";
const imgUsers = "https://www.figma.com/api/mcp/asset/68318c08-ca14-499f-9d15-6ec74d8d6b88";
const imgIcon4 = "https://www.figma.com/api/mcp/asset/8f300a99-bfb1-4d2f-8253-a411291d84dd";
const imgIcon5 = "https://www.figma.com/api/mcp/asset/483a81b7-d707-4166-9331-1a43c49aa37b";
const imgIcon6 = "https://www.figma.com/api/mcp/asset/aed871e1-767f-4df1-898d-2e342436c0da";
const imgLine12 = "https://www.figma.com/api/mcp/asset/efe557c3-1524-45ee-94b1-b9a2988d080e";
const imgFrame1010108038 = "https://www.figma.com/api/mcp/asset/10fbd61a-2e15-4995-87e2-5eb835fb2715";
const imgFileText = "https://www.figma.com/api/mcp/asset/8c3c483c-bca7-4bfe-b501-eff1f5d014ec";
const imgFrame1010107551 = "https://www.figma.com/api/mcp/asset/8d5f040f-f1ee-4496-9aad-8b106ebd102f";
const imgVideo = "https://www.figma.com/api/mcp/asset/399af001-bbf9-4371-b76a-87204c9db21f";
const imgFrame1010107552 = "https://www.figma.com/api/mcp/asset/d443990a-7b7c-430f-95da-a1425f2181bd";
const imgIcon7 = "https://www.figma.com/api/mcp/asset/6af8821a-31b8-4193-952e-264cfd267211";

type LogoProps = {
  className?: string;
};

function Logo({ className }: LogoProps) {
  return (
    <div className={className || "content-stretch flex items-start relative"} data-node-id="3833:19316">
      <div className="relative shrink-0 size-[32px]" data-node-id="3833:19317" data-name="Vector">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
      </div>
    </div>
  );
}

type TrajectoryEpisode = "consultation" | "followUp";

const trajectoryCopy: Record<
  TrajectoryEpisode,
  { title: string; date: string; pill: string; pillClass: string; mainPanelTitle: string }
> = {
  consultation: {
    title: "Virtual ED consultation",
    date: "2023-06-02 08:56 AM",
    pill: "Completed",
    pillClass:
      "bg-[#ecfdf3] border border-[#d1fadf] border-solid text-[#027a48]",
    mainPanelTitle: "Consultation intake",
  },
  followUp: {
    title: "Virtual ED Follow up",
    date: "2025-11-02 11:43 PM",
    pill: "Waiting",
    pillClass:
      "bg-[#e8f7fe] border border-[#d5eeff] border-solid text-[#0064b5]",
    mainPanelTitle: "Triage questionnaire",
  },
};

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <div className={`relative shrink-0 overflow-clip size-[24px] ${className ?? ""}`}>
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <img alt="" className="block max-w-none size-full" src={imgIcon4} />
        </div>
      </div>
    </div>
  );
}

const accordionEase = [0.4, 0, 0.2, 1] as const;

function TrajectoryAccordionItem({
  episode,
  label,
  expanded,
  onToggle,
  borderClass,
  children,
}: {
  episode: TrajectoryEpisode;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  borderClass: string;
  children: ReactNode;
}) {
  const meta = trajectoryCopy[episode];

  return (
    <div className={`bg-[var(--base\/white,white)] ${borderClass}`}>
      <motion.button
        type="button"
        layout
        onClick={onToggle}
        aria-expanded={expanded}
        className={`group flex w-full shrink-0 cursor-pointer items-center justify-between px-[24px] py-[10px] text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#0573d8] focus-visible:outline-none ${
          expanded
            ? "bg-[#f2f4f7]"
            : "bg-[var(--base\/white,white)] hover:bg-[#f9fafb]"
        }`}
      >
        <div className="content-stretch flex min-w-0 flex-1 flex-col items-start gap-[2px] pr-3">
          <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[18px] font-normal text-[#667085]">
            {label}
          </p>
          <p
            className={`font-['Inter:Regular',sans-serif] truncate text-[16px] leading-[24px] transition-colors ${
              expanded
                ? "font-medium text-[#0573d8]"
                : "font-normal text-[#101828] group-hover:text-[#0573d8]"
            }`}
          >
            {meta.title}
          </p>
        </div>
        <motion.div
          className="shrink-0"
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.3, ease: accordionEase }}
        >
          <ChevronRightIcon className="opacity-80" />
        </motion.div>
      </motion.button>

      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.38, ease: accordionEase },
          opacity: { duration: expanded ? 0.22 : 0.15, delay: expanded ? 0.06 : 0, ease: accordionEase },
        }}
        className="overflow-hidden"
      >
        <div className="flex flex-col">{children}</div>
      </motion.div>
    </div>
  );
}

function TrajectoryExpandedBody({ episode }: { episode: TrajectoryEpisode }) {
  const meta = trajectoryCopy[episode];

  return (
    <>
      <div className="bg-white content-stretch flex gap-[10px] items-start pl-[24px] pr-[8px] pt-[8px] relative shrink-0 w-full" data-node-id="22333:51148">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px pb-[16px] relative" data-node-id="22333:51149">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="22333:51150">
            <div className="flex min-w-0 max-w-full flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-end leading-[0] not-italic overflow-hidden text-[#101828] text-[24px] text-ellipsis" data-node-id="22333:51151">
              <p className="leading-[32px] overflow-hidden text-ellipsis">{meta.title}</p>
            </div>
            <div className="content-stretch flex flex-wrap gap-[12px] items-center relative shrink-0" data-node-id="22333:51152">
              <div className="border-[#e2e5eb] border-r border-solid content-stretch flex items-center relative shrink-0 pr-[12px]" data-node-id="22333:51153" data-name="Date début">
                <p className="font-['Maison_Neue:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#475467] text-[14px] whitespace-nowrap" data-node-id="22333:51154">
                  {meta.date}
                </p>
              </div>
              {episode === "followUp" && (
                <>
                  <p className="font-['Maison_Neue:Medium',sans-serif] leading-[20px] not-italic opacity-0 relative shrink-0 text-[#475467] text-[14px] whitespace-nowrap" data-node-id="22333:51155">
                    -
                  </p>
                  <div className="border-[#e2e5eb] border-r border-solid content-stretch flex items-center opacity-0 relative shrink-0" data-node-id="22333:51156" data-name="Date début">
                    <p className="font-['Maison_Neue:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#475467] text-[14px] whitespace-nowrap" data-node-id="22333:51157">
                      2023-06-02 08:56 AM
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0" data-node-id="22333:51158" data-name="Pill">
            <div
              className={`content-stretch flex items-center justify-center rounded-[16px] px-[10px] py-[2px] ${meta.pillClass}`}
              data-node-id="I22333:51158;1046:3821"
              data-name="_Pill base"
            >
              <p className="font-['Maison_Neue:Medium',sans-serif] text-center text-[14px] leading-[20px] not-italic whitespace-nowrap" data-node-id="I22333:51158;1046:3821;1046:26">
                {meta.pill}
              </p>
            </div>
          </div>
        </div>
        <a className="content-stretch cursor-pointer flex items-start relative rounded-[8px] shrink-0" data-node-id="22333:51159" data-name="Button">
          <div className="content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[8px] shrink-0" data-node-id="I22333:51159;1054:1482" data-name="_Button base">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="I22333:51159;1054:1482;1054:7053" data-name="printer">
              <div className="absolute inset-[8.33%]" data-node-id="I22333:51159;1054:1482;1054:7053;1037:34012" data-name="Icon">
                <div className="absolute inset-[-5%]">
                  <img alt="" className="block max-w-none size-full" src={imgIcon5} />
                </div>
              </div>
            </div>
          </div>
        </a>
        <a className="content-stretch cursor-pointer flex items-start relative rounded-[8px] shrink-0" data-node-id="22333:51160" data-name="Button">
          <div className="content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[8px] shrink-0" data-node-id="I22333:51160;1054:1482" data-name="_Button base">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="I22333:51160;1054:1482;1054:7053" data-name="more-horizontal">
              <div className="absolute inset-[45.83%_16.67%]" data-node-id="I22333:51160;1054:1482;1054:7053;1037:33991" data-name="Icon">
                <div className="absolute inset-[-50%_-6.25%]">
                  <img alt="" className="block max-w-none size-full" src={imgIcon6} />
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:51118">
        <div className="content-stretch flex flex-col gap-[10px] items-start pt-[24px] px-[16px] relative shrink-0 w-full" data-node-id="22333:50051">
          <div className="absolute flex h-[230px] items-center justify-center left-[24px] top-[100px] w-0">
            <div className="-rotate-90 flex-none">
              <div className="h-0 relative w-[230px]" data-node-id="22333:50052">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine12} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex isolate items-start pr-[16px] relative shrink-0 w-full" data-node-id="22333:50053">
            <div className="content-stretch flex flex-col isolate items-center mr-[-16px] pb-[4px] pr-[8px] pt-[19px] relative shrink-0 z-[2]" data-node-id="22333:50054">
              <div className="relative shrink-0 size-[15px] z-[1]" data-node-id="22333:50055">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1010108038} />
              </div>
            </div>
            <div className="bg-[var(--primary\/25,#f2faff)] border border-[var(--primary\/200,#bedffe)] border-solid content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px mr-[-16px] p-[16px] relative rounded-[4px] z-[1]" data-node-id="22333:50058">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:50059">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="22333:50060">
                  <div className="h-[18.84px] relative shrink-0 w-[14.5px]" data-node-id="22333:50061" data-name="file-text">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFileText} />
                  </div>
                  <p className="font-['Maison_Neue:Demi',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--gray\/800,#1d2939)] whitespace-nowrap" data-node-id="22333:50063">
                    Triage Questionnaire
                  </p>
                </div>
                <p className="font-['Maison_Neue:Book',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--gray\/500,#667085)] w-full" data-node-id="22333:50064">
                  2023-06-03 15:22
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex isolate items-start pr-[16px] relative shrink-0 w-full" data-node-id="22333:50065">
            <div className="h-[38px] mr-[-16px] relative shrink-0 w-[23px] z-[2]" data-node-id="22333:50066">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1010107551} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px mr-[-16px] p-[16px] relative rounded-[4px] z-[1]" data-node-id="22333:50068">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:50069">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="22333:50070">
                  <div className="relative shrink-0 size-[14px]" data-node-id="22333:50071" data-name="video">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVideo} />
                  </div>
                  <p className="font-['Maison_Neue:Demi',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--gray\/800,#1d2939)] whitespace-nowrap" data-node-id="22333:50073">
                    Virtual consultation
                  </p>
                </div>
                <p className="font-['Maison_Neue:Book',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--gray\/500,#667085)] w-full" data-node-id="22333:50074">
                  2023-06-03 15:22
                </p>
              </div>
              <div className="content-stretch flex items-start relative rounded-[8px] shrink-0" data-node-id="22333:50075" data-name="Button">
                <div className="bg-[#0573d8] border border-[#0573d8] border-solid content-stretch flex items-center justify-center overflow-clip px-[14px] py-[8px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)] shrink-0" data-node-id="I22333:50075;1040:4" data-name="_Button base">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="I22333:50075;1040:4;1054:6968">
                    Assign to me
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex isolate items-start pr-[16px] relative shrink-0 w-full" data-node-id="22333:50076">
            <div className="h-[38px] mr-[-16px] relative shrink-0 w-[23px] z-[2]" data-node-id="22333:50077">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1010107552} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px mr-[-16px] p-[16px] relative rounded-[4px] z-[1]" data-node-id="22333:50079">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:50080">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="22333:50081">
                  <div className="h-[18.84px] relative shrink-0 w-[14.5px]" data-node-id="22333:50082" data-name="file-text">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFileText} />
                  </div>
                  <p className="font-['Maison_Neue:Demi',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--gray\/800,#1d2939)] whitespace-nowrap" data-node-id="22333:50084">
                    Visit outcome
                  </p>
                </div>
                <p className="font-['Maison_Neue:Book',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--gray\/500,#667085)] w-full" data-node-id="22333:50085">
                  -
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex isolate items-start pr-[16px] relative shrink-0 w-full" data-node-id="22333:50086">
            <div className="h-[38px] mr-[-16px] relative shrink-0 w-[23px] z-[2]" data-node-id="22333:50087">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1010107552} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px mr-[-16px] p-[16px] relative rounded-[4px] z-[1]" data-node-id="22333:50089">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:50090">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="22333:50091">
                  <div className="h-[18.84px] relative shrink-0 w-[14.5px]" data-node-id="22333:50092" data-name="file-text">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFileText} />
                  </div>
                  <p className="font-['Maison_Neue:Demi',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--gray\/800,#1d2939)] whitespace-nowrap" data-node-id="22333:50094">
                    Consultation report
                  </p>
                </div>
                <p className="font-['Maison_Neue:Book',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--gray\/500,#667085)] w-full" data-node-id="22333:50095">
                  -
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center p-[16px] relative shrink-0" data-node-id="22333:50096">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="22333:50097" data-name="plus-circle">
            <div className="absolute inset-[8.33%]" data-node-id="I22333:50097;1037:34211" data-name="Icon">
              <div className="absolute inset-[-5%]">
                <img alt="" className="block max-w-none size-full" src={imgIcon7} />
              </div>
            </div>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--gray\/600,#475467)] whitespace-nowrap" data-node-id="22333:50098">
            Ajouter
          </p>
        </div>
      </div>
    </>
  );
}

/** Isolated Figma mockup: Trajectoire de soins — triage questionnaire (node 22333:50003). */
export function MockupTrajectoryCarePage() {
  const [expandedTrajectory, setExpandedTrajectory] = useState<TrajectoryEpisode>("followUp");

  return (
    <div className="bg-white content-stretch flex min-h-screen items-stretch relative w-full" data-node-id="22333:50003" data-name="Trajectoire de soins - Empty state">
      <div className="bg-white border-[var(--gray\/200,#e2e5eb)] border-r border-solid content-stretch flex min-h-screen items-start relative shadow-[0px_1px_5px_0px_rgba(16,24,40,0.05),0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0" data-node-id="22333:50004" data-name="Sidebar navigation">
        <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[82px]" data-node-id="I22333:50004;1165:117" data-name="Content">
          <div className="content-stretch flex flex-col gap-[24px] items-start pt-[32px] relative shrink-0 w-full" data-node-id="I22333:50004;1165:118" data-name="Nav">
            <div className="content-stretch flex items-start relative shrink-0" data-node-id="I22333:50004;7656:152428">
              <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="I22333:50004;7656:152429">
                <div className="content-stretch flex items-center justify-between pl-[24px] relative shrink-0 w-[98px]" data-node-id="I22333:50004;7656:152430" data-name="Header">
                  <Logo className="content-stretch flex items-start relative shrink-0" />
                  <div className="bg-white content-stretch flex items-center justify-center opacity-0 p-[8px] relative rounded-[16px] shadow-[0px_1px_5px_0px_rgba(16,24,40,0.05),0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0" data-node-id="I22333:50004;7656:153102" data-name="Featured icons">
                    <div className="overflow-clip relative shrink-0 size-[16px]" data-node-id="I22333:50004;7656:153102;1130:88647" data-name="expand-menu">
                      <div className="absolute inset-[20.83%_8.33%_20.83%_16.67%]" data-node-id="I22333:50004;7656:153102;1130:88647;7614:152542" data-name="Icon">
                        <div className="absolute inset-[-7.14%_-5.56%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I22333:50004;7656:147537">
              <div className="content-stretch flex flex-col h-[64px] items-start px-[12px] relative shrink-0 w-full" data-node-id="I22333:50004;7841:161317">
                <div className="bg-[#f9fafb] content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px p-[12px] relative rounded-[8px] w-full" data-node-id="I22333:50004;7841:161318">
                  <p className="flex-[1_0_0] font-['Maison_Neue:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic overflow-hidden relative text-[#475467] text-[14px] text-ellipsis whitespace-nowrap" data-node-id="I22333:50004;7841:161319">
                    CIUSSS Centre Ouest - Jewish General Hospital
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-center px-[16px] relative shrink-0 w-full" data-node-id="I22333:50004;1165:123" data-name="Navigation">
              <div className="bg-white content-stretch flex items-center justify-center overflow-clip p-[12px] relative rounded-[6px] shrink-0 size-[40px]" data-node-id="I22333:50004;1165:760" data-name="_Nav item button">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="I22333:50004;1165:760;1165:594" data-name="clipboard">
                  <div className="absolute inset-[8.33%_16.67%]" data-node-id="I22333:50004;1165:760;1165:594;1037:34049" data-name="Icon">
                    <div className="absolute inset-[-5%_-6.25%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white content-stretch flex items-center justify-center overflow-clip p-[12px] relative rounded-[6px] shrink-0 size-[40px]" data-node-id="I22333:50004;1165:763" data-name="_Nav item button">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="I22333:50004;1165:763;1165:594" data-name="bar-chart-2">
                  <div className="absolute bottom-[16.67%] left-1/4 right-1/4 top-[16.67%]" data-node-id="I22333:50004;1165:763;1165:594;1157:91024" data-name="Icon">
                    <div className="absolute inset-[-6.25%_-8.33%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[24px] items-center pb-[12px] px-[16px] relative shrink-0 w-full" data-node-id="I22333:50004;1165:130" data-name="Footer">
            <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-node-id="I22333:50004;1165:131" data-name="Navigation">
              <div className="bg-white content-stretch flex items-center justify-center overflow-clip p-[12px] relative rounded-[6px] shrink-0 size-[40px]" data-node-id="I22333:50004;7656:148495" data-name="_Nav item button">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="I22333:50004;7656:148495;1165:594" data-name="language">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[20px] left-1/2 top-1/2 w-[22px]" data-node-id="I22333:50004;7656:148495;1165:594;7656:152376" data-name="Icon">
                    <div className="absolute inset-[-5%_-4.55%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white content-stretch flex items-center justify-center overflow-clip p-[12px] relative rounded-[6px] shrink-0 size-[40px]" data-node-id="I22333:50004;7656:148329" data-name="_Nav item button">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="I22333:50004;7656:148329;1165:594" data-name="Icon / Outlined / Ant / QuestionCircle">
                  <div className="absolute inset-[6.25%]" data-node-id="I22333:50004;7656:148329;1165:594;471:2225" data-name="Vector">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
                  </div>
                  <div className="absolute inset-[26.95%_34.38%_24.61%_34.38%]" data-node-id="I22333:50004;7656:148329;1165:594;471:2226" data-name="Vector">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px relative shrink-0 w-full" data-node-id="I22333:50004;1165:135" data-name="Divider">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDivider} />
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="I22333:50004;8144:157244">
              <div className="bg-[#f9fafb] relative rounded-[200px] shrink-0 size-[44px]" data-node-id="I22333:50004;1165:137" data-name="Avatar">
                <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-1/2 not-italic text-[#475467] text-[16px] text-center top-[calc(50%-12px)] w-[40px]" data-node-id="I22333:50004;1165:137;19:1257">
                  OR
                </p>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#475467] text-[12px] whitespace-nowrap" data-node-id="I22333:50004;8144:156125">
                v5.4.1
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex w-full min-w-px flex-[1_0_0] flex-col isolate items-stretch min-h-screen relative" data-node-id="22333:50005" data-name="Content">
        <div className="bg-[#f2f4f7] content-stretch flex w-full min-w-px flex-[1_0_0] min-h-0 flex-row items-stretch relative z-[1]" data-node-id="22333:50006" data-name="Body">
          <motion.div
            layout
            className="bg-[var(--gray\/50,#f9fafb)] flex min-h-0 min-w-0 w-[361px] shrink-0 flex-col overflow-x-hidden border-[var(--gray\/300,#d0d5dd)] border-x border-solid"
            data-node-id="22333:50007"
          >
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[16px] items-start overflow-x-hidden overflow-y-auto" data-node-id="22333:51123">
              <div className="bg-white content-stretch flex flex-col gap-[8px] items-start pt-[16px] relative shrink-0 w-full" data-node-id="22333:50008">
                <div className="content-stretch flex flex-col items-start px-[24px] relative shrink-0 w-full" data-node-id="22333:50009">
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="22333:50010">
                    <div className="relative shrink-0 size-[18px]" data-node-id="22333:50011" data-name="chevron-left">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                    </div>
                    <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-end leading-[0] not-italic relative shrink-0 text-[#0573d8] text-[14px] whitespace-nowrap" data-node-id="22333:50013">
                      <p className="leading-[20px]">Back to worklist</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex w-full min-w-0 flex-col items-start relative shrink-0" data-node-id="22333:50014">
                  <div className="bg-white border-[var(--gray\/200,#e2e5eb)] border-b border-r border-solid border-t content-stretch flex flex-col items-start overflow-clip relative rounded-br-[4px] rounded-tr-[4px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] shrink-0 w-full" data-node-id="22333:50015" data-name="Patient card">
                    <div className="bg-[var(--gray\/50,#f9fafb)] content-stretch flex gap-[10px] items-center overflow-clip px-[16px] py-[24px] relative shrink-0 w-full" data-node-id="22333:50016">
                      <div className="border-[1.5px] border-solid border-white relative rounded-[200px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)] shrink-0 size-[44px]" data-node-id="22333:50017" data-name="Avatar">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[200px] size-full" src={imgAvatar} />
                      </div>
                      <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="22333:50018">
                        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="22333:50019">
                          <p className="font-['Maison_Neue:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[color:var(--gray\/800,#1d2939)] text-center whitespace-nowrap" data-node-id="22333:50020">
                            Jane Doe
                          </p>
                          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="22333:50021">
                            <div className="overflow-clip relative shrink-0 size-[15px]" data-node-id="22333:50022" data-name="Icon / Outlined / Female">
                              <div className="absolute inset-[4.17%_20.83%_0_20.83%]" data-node-id="22333:50023" data-name="Frame">
                                <div className="absolute inset-[-4.35%_-7.14%_0_-7.14%]">
                                  <img alt="" className="block max-w-none size-full" src={imgFrame} />
                                </div>
                              </div>
                            </div>
                            <div className="h-[22px] relative shrink-0 w-[17px]" data-node-id="22333:50027">
                              <div className="absolute inset-[-4.55%_-5.88%]">
                                <img alt="" className="block max-w-none size-full" src={imgFrame499} />
                              </div>
                            </div>
                            <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[30px]" data-node-id="22333:50032">
                              <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[11px]" data-node-id="22333:50033">
                                <p className="font-['Maison_Neue:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0573d8] text-[14px] whitespace-nowrap" data-node-id="22333:50034">
                                  1
                                </p>
                              </div>
                              <div className="relative shrink-0 size-[19px]" data-node-id="22333:50035" data-name="users">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUsers} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex font-['Maison_Neue:Book',sans-serif] gap-[16px] items-start leading-[0] not-italic relative shrink-0 text-[#475467] text-[14px] whitespace-nowrap" data-node-id="22333:50037">
                          <div className="flex flex-col justify-center relative shrink-0" data-node-id="22333:50038">
                            <p className="leading-[20px]">AAAA 0000 0000</p>
                          </div>
                          <div className="flex flex-col justify-center relative shrink-0" data-node-id="22333:50039">
                            <p className="leading-[20px]">2000-12-25 (25 ans)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:51122">
                <TrajectoryAccordionItem
                  episode="consultation"
                  label="Previously"
                  expanded={expandedTrajectory === "consultation"}
                  onToggle={() => setExpandedTrajectory("consultation")}
                  borderClass="border-b border-[var(--gray\/100,#f2f4f7)] border-solid"
                >
                  <TrajectoryExpandedBody episode="consultation" />
                </TrajectoryAccordionItem>
                <TrajectoryAccordionItem
                  episode="followUp"
                  label="Next"
                  expanded={expandedTrajectory === "followUp"}
                  onToggle={() => setExpandedTrajectory("followUp")}
                  borderClass=""
                >
                  <TrajectoryExpandedBody episode="followUp" />
                </TrajectoryAccordionItem>
              </div>
            </div>
          </motion.div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px px-[60px] py-[32px] relative" data-node-id="22333:50099">
            <div className="bg-white border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex flex-col items-start p-[24px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50100">
              <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="22333:50101">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="22333:50102">
                  <motion.p
                    key={expandedTrajectory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] not-italic relative shrink-0 text-[#101828] text-[20px] whitespace-nowrap"
                    data-node-id="22333:50103"
                  >
                    {trajectoryCopy[expandedTrajectory].mainPanelTitle}
                  </motion.p>
                </div>
                <div className="content-stretch flex items-start relative shrink-0" data-node-id="22333:50104" data-name="Pill">
                  <div className="bg-[#ecfdf3] border border-[#d1fadf] border-solid content-stretch flex items-center justify-center px-[10px] py-[2px] relative rounded-[16px] shrink-0" data-node-id="I22333:50104;1046:4838" data-name="_Pill base">
                    <p className="font-['Maison_Neue:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#027a48] text-[14px] text-center whitespace-nowrap" data-node-id="I22333:50104;1046:4838;1046:26">
                      Submitted
                    </p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="22333:50105">
                <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-node-id="22333:50106">
                  <p className="font-['Maison_Neue:Medium',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#475467] text-[14px] text-ellipsis whitespace-nowrap" data-node-id="22333:50107">
                    Submitted on
                  </p>
                </div>
                <div className="content-stretch flex font-['Maison_Neue:Medium',sans-serif] gap-[8px] items-center leading-[20px] not-italic relative shrink-0 text-[#475467] text-[14px] whitespace-nowrap" data-node-id="22333:50108">
                  <p className="overflow-hidden relative shrink-0 text-ellipsis" data-node-id="22333:50109">
                    2025-11-02
                  </p>
                  <p className="overflow-hidden relative shrink-0 text-ellipsis" data-node-id="22333:50110">
                    15:34
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="22333:50111">
              <div className="content-stretch flex gap-[8px] items-start relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)] shrink-0" data-node-id="22333:50112" data-name="Button group">
                <div className="bg-[#e8f7fe] border border-[#e2e5eb] border-solid content-stretch flex items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-node-id="22333:50113" data-name="_Button group base">
                  <ol className="block font-['Inter:Medium',sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#0573d8] text-[14px] whitespace-nowrap" data-node-id="22333:50114" start={1}>
                    <li className="ms-[21px]">
                      <span className="leading-[20px]">Personnal informations</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-white content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0" data-node-id="22333:50115" data-name="_Button group base">
                  <div className="bg-[#e2e5eb] h-px shrink-0 w-full" data-node-id="22333:50116" data-name="Top line" />
                  <div className="content-stretch flex items-center justify-center px-[16px] py-[9px] relative shrink-0" data-node-id="22333:50117" data-name="Content">
                    <ol className="block font-['Inter:Medium',sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#344054] text-[14px] whitespace-nowrap" data-node-id="22333:50118" start={2}>
                      <li className="ms-[21px]">
                        <span className="leading-[20px]">{`Reason for consultation `}</span>
                      </li>
                    </ol>
                  </div>
                  <div className="bg-[#e2e5eb] h-px shrink-0 w-full" data-node-id="22333:50119" data-name="Bottom line" />
                </div>
                <div className="bg-white border border-[#e2e5eb] border-solid content-stretch flex items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-node-id="22333:50134" data-name="_Button group base">
                  <ol className="block font-['Inter:Medium',sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#344054] text-[14px] whitespace-nowrap" data-node-id="22333:50135" start={3}>
                    <li className="ms-[21px]">
                      <span className="leading-[20px]">{`Pharmacy & reference`}</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="bg-white border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start p-[24px] relative rounded-[5px] shrink-0" data-node-id="22333:50136">
                <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[858px]" data-node-id="22333:50137" data-name="Conclusion">
                  <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="22333:50138" data-name="Titre">
                    <p className="font-['Maison_Neue:Medium',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#101828] text-[18px] whitespace-nowrap" data-node-id="22333:50139">
                      Personnal informations
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="22333:50171">
                    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="22333:50172">
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px py-[12px] relative rounded-[5px]" data-node-id="22333:50173">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50174">
                          First Name
                        </p>
                        <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50175">
                          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50176">
                            Jane
                          </p>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px py-[12px] relative rounded-[5px]" data-node-id="22333:50177">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50178">
                          Last Name
                        </p>
                        <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50179">
                          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50180">
                            Doe
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[8px] items-start py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50181">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50182">
                        Date of Birth
                      </p>
                      <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50183">
                        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50184">
                          November 25, 1989 (25/11/1989 - 37 y/o)
                        </p>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[8px] items-start py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50185">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50186">
                        Email
                      </p>
                      <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50187">
                        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50188">
                          j.doe@email.com
                        </p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="22333:50189">
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px py-[12px] relative rounded-[5px]" data-node-id="22333:50190">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50191">
                          Phone Number
                        </p>
                        <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50192">
                          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50193">
                            555-555-5555
                          </p>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px py-[12px] relative rounded-[5px]" data-node-id="22333:50194">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50195">
                          Type
                        </p>
                        <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50196">
                          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50197">
                            Mobile
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[8px] items-start py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50198">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50199">
                        Address
                      </p>
                      <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50200">
                        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50201">
                          123 main street, G1D 1H2, Montreal, Qc
                        </p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="22333:50202">
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px py-[12px] relative rounded-[5px]" data-node-id="22333:50203">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50204">
                          RAMQ
                        </p>
                        <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50205">
                          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50206">
                            JDOE 1234 1234
                          </p>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px py-[12px] relative rounded-[5px]" data-node-id="22333:50207">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] w-full" data-node-id="22333:50208">
                          Expiration
                        </p>
                        <div className="border border-[var(--gray\/200,#e2e5eb)] border-solid content-stretch flex items-start px-[16px] py-[12px] relative rounded-[5px] shrink-0 w-full" data-node-id="22333:50209">
                          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[#344054] text-[16px]" data-node-id="22333:50210">
                            16/09/2028
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}