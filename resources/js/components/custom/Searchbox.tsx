export default function SearchBox({
    onSearch = (s) => {},
    value = '',
}: {
    onSearch?: (s: string) => void;
    value?: string;
}) {
    return (
        <div className="mr-2">
            <div className="relative w-32 transition-all duration-100 ease-linear hover:w-52">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center p-2">
                    <svg
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    onChange={(e) => onSearch(e.target.value)}
                    defaultValue={value}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm overflow-ellipsis text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Search Name, Origin..."
                    required
                />
            </div>
        </div>
    );
}
