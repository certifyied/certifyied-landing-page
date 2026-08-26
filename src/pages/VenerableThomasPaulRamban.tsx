import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Award, Shield, Heart, ArrowLeft, Calendar, User, Scale, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const VenerableThomasPaulRamban = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2a29] font-sans selection:bg-[#dfd3c3] selection:text-[#2c2a29]">
      {/* Editorial Top bar */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/80 backdrop-blur-md border-b border-[#ebdcd0]/40 px-4 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-medium text-[#7a6552] hover:text-[#504033] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>തിരികെ പ്രധാന പേജിലേക്ക്</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#9c8470] font-semibold">Special Feature</span>
          <Bookmark className="w-4 h-4 text-[#9c8470] cursor-pointer hover:text-[#504033] transition-colors" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-4 justify-center text-[#7a6552] text-sm font-medium mb-6">
          <span className="bg-[#ebdcd0] text-[#504033] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            സഭാ ചരിത്രം
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>2026 ആഗസ്റ്റ് 26</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>എഴുതിയത്: ഫിലയാ...</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#1c1a19] leading-tight mb-8 font-serif">
          മലങ്കര ഓർത്തഡോക്സ് സഭയുടെ ചരിത്രത്തിലെ ഏറ്റവും ശക്തനായ <span className="text-[#8c2a1c] relative inline-block">“പോരാളി”</span> വന്ദ്യനായ തോമസ് പോൾ റമ്പാച്ചൻ..
        </h1>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 border-4 border-white aspect-[16/9]"
        >
          <img 
            src="/thomas_paul_ramban.jpg" 
            alt="വന്ദ്യനായ തോമസ് പോൾ റമ്പാൻ"
            className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm text-center font-medium bg-black/30 backdrop-blur-sm py-2 px-4 rounded-lg">
            കോതമംഗലം ചെറിയ പള്ളിയിലെ പ്രാർത്ഥനാ സമരമുഖത്ത് വന്ദ്യനായ തോമസ് പോൾ റമ്പാൻ
          </div>
        </motion.div>

        {/* Article Intro Card */}
        <div className="bg-[#f0eade] border-l-4 border-[#8c2a1c] p-6 rounded-r-xl mb-12 shadow-sm">
          <p className="text-lg sm:text-xl text-[#3d3835] leading-relaxed italic font-serif">
            "സഭയുടെ അവകാശങ്ങൾക്കും സുപ്രീം കോടതി വിധി നടപ്പാക്കുന്നതിനും വേണ്ടി ധീരമായി നിയമപോരാട്ടം നടത്തിയ പണ്ഡിതനായ വൈദികശ്രേഷ്ഠൻ… അദ്ദേഹം നടത്തിയ ആത്മീയവും നിയമപരവുമായ പോരാട്ടങ്ങൾ മലങ്കര സഭയിൽ വലിയ ചലനങ്ങൾ സൃഷ്ടിച്ചു. അദ്ദേഹത്തിന്റെ പോരാട്ടവീര്യം സഭാ മക്കളുടെ ഹൃദയത്തിലെ മാർത്തോമൻ നസ്രാണി സ്വത്വബോധത്തെ തഴുകി ഉണർത്തി."
          </p>
        </div>

        {/* Content body split into segments */}
        <div className="space-y-12 text-lg leading-relaxed text-[#3d3835]">
          
          {/* Section 1: Kothamangalam Cheriyapally */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdcd0]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#fdf5f0] text-[#8c2a1c] rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#1c1a19]">കോതമംഗലം ചെറിയ പള്ളിയിലെ ചരിത്രപരമായ പ്രാർത്ഥനായജ്ഞം</h2>
            </div>
            <p className="mb-4">
              കോതമംഗലം ചെറിയ പള്ളിയിലെ ചരിത്രപരമായ പ്രാർത്ഥനായജ്ഞം ഭാരതത്തിന്റെ നീതിന്യായ വിധി നടപ്പാക്കാനും പരിശുദ്ധ സഭയുടെ നേരെ വരുന്ന ക്രൂരമായ അക്രമങ്ങൾക്ക് അറുതിവരുത്താനുമായിരുന്നു.
            </p>
            <p>
              കോതമംഗലം മാർതോമൻ ചെറിയ പള്ളിയുടെ വികാരിയായ വന്ദ്യ. തോമസ് പോൾ റമ്പാൻ പ്രതിസന്ധികളുടെ നടുവിൽ അർഹമായതും നീതിയുക്തമായും ലഭിച്ച ദൈവാലയത്തിൽ പ്രവേശിച്ച് പ്രാർത്ഥന നടത്തുവനായി അദ്ദേഹം എത്തിയപ്പോൾ വിഘടിത വിഭാഗം വിശ്വാസികൾ അദ്ദേഹത്തെ ശക്തമായി തടഞ്ഞു.
            </p>
          </section>

          {/* Suffer Protest highlight (Quote) */}
          <section className="relative py-12 px-6 bg-[#8c2a1c] text-white rounded-2xl overflow-hidden shadow-xl text-center">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 -translate-y-12" />
            <span className="text-5xl font-serif text-white/30 block mb-2">“</span>
            <p className="text-xl sm:text-2xl font-serif font-bold italic max-w-2xl mx-auto mb-6 leading-normal">
              “വെറും കൈയോടെ പിന്നോട്ടില്ലെന്നും കോടതി വിധി നടപ്പാക്കുന്നത് വരെ മടങ്ങില്ലെന്നുമുള്ള”
            </p>
            <p className="text-sm uppercase tracking-wider text-[#ebdcd0] font-semibold">
              അചഞ്ചലമായ സഹനസമരം • 26 മണിക്കൂറിലധികം സ്വന്തം വാഹനത്തിൽ
            </p>
            <div className="mt-6 text-sm text-white/80 max-w-xl mx-auto">
              അചഞ്ചലമായ നിലപാടിലൂടെ കടുത്ത പ്രതിഷേധങ്ങൾക്കും ഭീഷണികൾക്കും നടുവിൽ 26 മണിക്കൂറിലധികം അദ്ദേഹം തന്റെ വാഹനത്തിൽ തന്നെ സഹനസമരം നടത്തി. അദ്ദേഹത്തിന്റെ നിലപാട് ഓർത്തഡോക്സ് വിശ്വാസികൾക്ക് വലിയ ആവേശമായി. ചരിത്രപരമായ ആ പോരാട്ടം തെക്കൻ ഭദ്രാസനങ്ങളിലും വലിയ ഉണർവിന് വഴിയൊരുക്കി.
            </div>
          </section>

          {/* Section 2: Legal and Constitution */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdcd0]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#e8f1f5] text-[#2c6e91] rounded-xl">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#1c1a19]">നിയമപോരാട്ടവും ഭരണഘടനയും</h2>
            </div>
            <p className="mb-4">
              നിയമപരമായ പോരാട്ടങ്ങളിലൂടെ ഭരണഘടനയനുസരിച്ചുള്ള ഭരണം കോതമംഗലം പള്ളിയിലും അങ്കമാലി ഭദ്രാസനത്തിലെ മറ്റ് ഇടവകകളിലും ഉറപ്പാക്കാൻ അദ്ദേഹം നിരവധി നിയമപോരാട്ടങ്ങൾക്ക് നേതൃത്വം നൽകി.
            </p>
            <p>
              ഭീഷണികൾക്ക് മുന്നിൽ വഴങ്ങാതെ, ഭാരതത്തിലെ നിയമത്തിന്റെ വഴിയിലൂടെ പരിശുദ്ധ സഭയുടെ തനിമ നിലനിർത്താൻ അദ്ദേഹത്തിന്റെ ശ്രമങ്ങൾ ഇന്നും തുടരുന്നു. ആർജവത്തോടെ തളരാതെ പോരാടാൻ അദ്ദേഹത്തിന്റെ കൂടെ മലങ്കര മക്കളുടെ അകമഴിഞ്ഞ പ്രാർത്ഥന എന്നും ഉണ്ടായിരുന്നു.
            </p>
          </section>

          {/* Section 3: Educational Qualifications */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdcd0]/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#eef8f3] text-[#2e7d32] rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#1c1a19]">വിദ്യാഭ്യാസ യോഗ്യതകളും പാണ്ഡിത്യവും</h2>
            </div>
            <p className="mb-6">
              സഭയുടെ കാനോൻ നിയമങ്ങളിലും സിവിൽ നിയമങ്ങളിലും ഒരുപോലെ അറിവുള്ള തോമസ് പോൾ റമ്പാച്ചന്റെ പാണ്ഡിത്യം അത്ഭുതകരമാണ്. വിവിധ മേഖലകളിലെ അദ്ദേഹത്തിന്റെ വൈദഗ്ധ്യം താഴെ പറയുന്നവയാണ്:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8fcf9] border border-[#d0edd5] rounded-xl flex items-start gap-3">
                <div className="bg-[#d0edd5] text-[#2e7d32] font-extrabold px-2.5 py-1 rounded text-xs mt-0.5">LL.B</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19] text-base">നിയമ ബിരുദം</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">കോടതികളിൽ സഭയുടെ അവകാശങ്ങൾക്കായി ശക്തമായി വാദിക്കാൻ അദ്ദേഹത്തെ സഹായിക്കുന്നു.</p>
                </div>
              </div>
              <div className="p-4 bg-[#f8fcf9] border border-[#d0edd5] rounded-xl flex items-start gap-3">
                <div className="bg-[#d0edd5] text-[#2e7d32] font-extrabold px-2.5 py-1 rounded text-xs mt-0.5">B.D</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19] text-base">വൈദികപഠനത്തിലെ ഉന്നത ബിരുദം</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">സഭാ കാനോനുകളിലും വിശ്വാസ സംഹിതകളിലും അഗാധമായ വിജ്ഞാനം പകർന്നു നൽകുന്നു.</p>
                </div>
              </div>
              <div className="p-4 bg-[#f8fcf9] border border-[#d0edd5] rounded-xl flex items-start gap-3">
                <div className="bg-[#d0edd5] text-[#2e7d32] font-extrabold px-2 py-1 rounded text-xs mt-0.5">M.Sc</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19] text-base">ശാസ്ത്ര ബിരുദാനന്തര ബിരുദം</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">വൈജ്ഞാനികവും ശാസ്ത്രീയവുമായ ചിന്താധാരയെ പ്രവൃത്തികളിൽ സ്വാംശീകരിക്കാൻ സഹായിക്കുന്നു.</p>
                </div>
              </div>
              <div className="p-4 bg-[#f8fcf9] border border-[#d0edd5] rounded-xl flex items-start gap-3">
                <div className="bg-[#d0edd5] text-[#2e7d32] font-extrabold px-2 py-1 rounded text-xs mt-0.5">MSW / M.Phil</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19] text-base">സോഷ്യൽ വർക്ക് & ഗവേഷണം</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">സാമൂഹിക പ്രവർത്തനമികവുകൾക്കും പൊതുനന്മക്കുമായി ഗവേഷണ ബിരുദങ്ങൾ ഉപയോഗിക്കുന്നു.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Achievements and Positions */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdcd0]/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#faf2e6] text-[#b37400] rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#1c1a19]">സഭാ സേവനങ്ങളും ഔദ്യോഗിക പദവികളും</h2>
            </div>
            <p className="mb-6">
              വൈവിധ്യമാർന്ന സഭാ സേവനങ്ങൾ കേവലം ഒരു പോരാളി എന്നതിൽ മാത്രമൊതുക്കാതെ പരിശുദ്ധ സഭയുടെയും പൊതു സമൂഹത്തിന്റെയും വിവിധ മേഖലകളിൽ അദ്ദേഹം വ്യക്തിമുദ്ര പതിപ്പിച്ചിട്ടുണ്ട്.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b border-[#f0eade] pb-4">
                <div className="bg-[#faf2e6] text-[#b37400] px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap mt-1">അധ്യാപനം & ആത്മീയത</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19]">എത്യോപ്യൻ ഓർത്തഡോക്സ് സെമിനാരി ലക്ചറർ</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">അന്താരാഷ്ട്ര തലത്തിൽ വൈദിക അധ്യാപന രംഗത്ത് പ്രവർത്തിച്ചു. തൃക്കുന്നത്തു സെമിനാരി അസിസ്റ്റന്റ് മാനേജരായും സേവനമനുഷ്ഠിച്ചു.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-[#f0eade] pb-4">
                <div className="bg-[#faf2e6] text-[#b37400] px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap mt-1">സാമൂഹിക പ്രവർത്തനം</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19]">അഖില കേരള ബാലജനസഖ്യം സംസ്ഥാന പ്രസിഡന്റ്</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">മലയാള മനോരമ അഖില കേരള ബാലജനസഖ്യത്തിന്റെ സംസ്ഥാന പ്രസിഡന്റായി സാമൂഹിക നന്മക്കായി പ്രവർത്തിച്ചു.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-2">
                <div className="bg-[#faf2e6] text-[#b37400] px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap mt-1">ഭരണ നേതൃത്വം</div>
                <div>
                  <h4 className="font-bold text-[#1c1a19]">പള്ളി, അരമന, ആശ്രമ മാനേജർ പദവികൾ</h4>
                  <p className="text-sm text-[#5a5552] mt-0.5">കോതമംഗലം ചെറിയ പള്ളി, മൂവാറ്റുപുഴ അരമന മാനേജർ, കോതനാട് സീയോൻ ആശ്രമം മാനേജർ എന്നീ നിലകളിൽ മികച്ച ഭരണമികവ് പുലർത്തി.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Prayer call & Leadership forecast */}
          <section className="bg-[#fcfaf7] border border-[#ebdcd0] p-8 rounded-2xl text-center space-y-6">
            <div className="inline-flex p-3.5 bg-[#fcf4e8] text-[#8c2a1c] rounded-full">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1c1a19]">മലങ്കര സഭയെ നയിക്കാൻ ഉത്തമനായ പിതാവ്</h3>
            <p className="max-w-2xl mx-auto text-[#5a5552]">
              സഭ അതിന്റെ നവീനത്വവും ജീവസ്സും വിശ്വാസധീരതയും കാത്തുസൂക്ഷിക്കുന്നതിലാണന്ന ഉറച്ച വിശ്വാസത്തിൽ, തന്റെ അംഗങ്ങളുടെ രക്ഷയിൽ മാത്രം ശ്രദ്ധിക്കാതെ ലോകത്തിൽ നന്മയുണ്ടെന്നു വിശ്വസിച്ച് അവയെ പരിപോഷിപ്പിക്കാൻ സഭാമക്കളുടെ ഇടയിൽ വചനശുശ്രൂഷയിൽ മുന്നേറുന്ന റമ്പാച്ചൻ വരും നാളുകളിൽ മലങ്കര സഭയെ നയിക്കാൻ ഏറ്റവും ഉത്തമനായ പിതാക്കന്മാരിൽ ഒരാളാണ്.
            </p>
            <div className="pt-4 border-t border-[#ebdcd0]/60 max-w-xl mx-auto">
              <p className="font-bold text-[#8c2a1c] mb-2">പ്രാർത്ഥനയോടെ ഓർക്കാം...</p>
              <p className="text-sm text-[#5a5552]">
                പ്രാർത്ഥനയിൽ ഉറച്ചു വിശ്വസിച്ച് ദൈവീക സ്വരവും പരിശുദ്ധാത്മാവിന്റെ പ്രേരണയിലും പരിശുദ്ധ സഭക്ക് വേണ്ടി പ്രയത്നിക്കുന്ന വന്ദ്യ. തോമസ് പോൾ റമ്പാച്ചനെ നമ്മുടെ പ്രാർത്ഥനയിൽ ദിനംപ്രതി ഓർക്കാം... പരിശുദ്ധ സഭക്ക് വേണ്ടി കൂടുതൽ ഉണർന്ന് പ്രവർത്തിക്കാൻ.
              </p>
            </div>
          </section>

        </div>

        {/* Footer Signature */}
        <footer className="mt-16 pt-8 border-t border-[#ebdcd0]/60 text-center">
          <p className="text-[#9c8470] italic text-base">
            ലേഖനം തയ്യാറാക്കിയത്: <span className="font-serif font-bold text-[#504033] ml-1">ഫിലയാ...</span>
          </p>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm bg-[#504033] text-white px-5 py-2.5 rounded-full hover:bg-[#8c2a1c] transition-all duration-300 shadow-md">
              <ArrowLeft className="w-4 h-4" />
              <span>തിരികെ പ്രധാന പേജിലേക്ക്</span>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default VenerableThomasPaulRamban;
