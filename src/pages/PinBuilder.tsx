import React, { useState } from 'react';
import Form from '../components/Form';
import Sidebar from '../components/Sidebar';
import InputField from '../components/InputField';

const PinBuilder = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    return (
        <div className="flex h-screen">
            <div className="fixed h-[80px] bg-white z-[1000] top-0 left-0 w-full">Header</div>

            <div className="flex items-center border-t border-b border-gray-200 fixed top-[80px] left-0 h-[81px] w-full z-10 bg-white">
                <div className="w-[110px]"></div>
                <h1 className="text-xl font-semibold text-gray-900">핀 만들기</h1>
            </div>

            {/* 사이드바 */}
            <Sidebar />

            {/* 메인 콘텐츠 */}
            <div className="flex flex-row w-full">
                {/* 첫 번째 영역 */}
                <div
                    className={`flex flex-col transition-all duration-300 max-w-[584px] ${
                        isSidebarExpanded ? 'ml-64' : 'ml-20'
                    } mt-[180px] px-6 ml-[180px]`}
                >
                    <div className="m-[24px]">
                        <Form />
                        <hr className="w-full border-t border-gray-200 my-6" />
                        <button className="w-full py-2 text-black bg-gray-200 rounded-full hover:bg-gray-300">
                            URL에서 저장
                        </button>
                    </div>
                </div>

                {/* 두 번째 영역 */}
                <div className="flex flex-col w-full max-w-[778px] mt-[180px] px-6 mr-[250px]">
                    <div className="m-[24px]">
                        <form className="space-y-6">
                            <InputField label="제목" placeholder="제목 추가" />
                            <InputField label="설명" placeholder="자세한 설명을 추가하세요." textarea />
                            <InputField label="링크" placeholder="링크 추가" type="url" />
                            <InputField label="보드" placeholder="보드 선택" />
                            <InputField label="태그된 주제 (0)개" placeholder="태그 검색" />
                            <p className="text-[#767676] inline-block text-xs !m-0 !mt-2">
                                걱정하지 마세요. 사람들에게 태그는 보여지지 않습니다.
                            </p>
                            <div>
                                <div className="inline-block font-semibold">추가 옵션</div>
                                <div className="inline-block ml-[7px]">
                                    <svg
                                        aria-label="보드 닫기"
                                        className="Uvi gUZ U9O kVc"
                                        height="12"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="12"
                                    >
                                        <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-[#767676] pb-[16px]">
                                불법 촬영 콘텐츠 등을 게시하는 경우 Pinterest는 한국 전기통신사업법 제22-5(1)조에 따라
                                해당 콘텐츠의 액세스를 삭제하거나 차단할 수 있으며, 사용자는 관련 법률 및 규정에 따라
                                처벌을 받을 수 있습니다.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinBuilder;
