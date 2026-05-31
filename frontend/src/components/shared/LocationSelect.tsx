import { useState, useEffect } from "react";
import { useProvinces, useCities } from "@/hooks/useLocation";
import { Loader2, AlertCircle } from "lucide-react";

interface LocationSelectProps {
  provinceValue?: string; // Stores the active province name
  cityValue?: string;     // Stores the active city name
  onChange: (data: { province: string; city: string }) => void;
  provinceError?: string;
  cityError?: string;
  disabled?: boolean;
}

export function LocationSelect({
  provinceValue = "",
  cityValue = "",
  onChange,
  provinceError,
  cityError,
  disabled = false,
}: LocationSelectProps) {
  const { data: provinces = [], isLoading: isLoadingProvinces, error: errorProvinces, refetch: refetchProvinces } = useProvinces();
  
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(provinceValue);
  const [selectedCityName, setSelectedCityName] = useState<string>(cityValue);

  // Load cities once we have a valid province ID
  const { data: cities = [], isLoading: isLoadingCities, error: errorCities, refetch: refetchCities } = useCities(selectedProvinceId);

  // Sync initial provinceValue with the corresponding province ID from the list
  useEffect(() => {
    if (provinceValue && provinces.length > 0) {
      const match = provinces.find(
        (p) => p.name.toLowerCase() === provinceValue.toLowerCase()
      );
      if (match && match.id !== selectedProvinceId) {
        setSelectedProvinceId(match.id);
        setSelectedProvinceName(match.name);
      }
    }
  }, [provinceValue, provinces]);

  // Handle manual province selection change
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const match = provinces.find((p) => p.id === provinceId);
    
    if (match) {
      setSelectedProvinceId(provinceId);
      setSelectedProvinceName(match.name);
      setSelectedCityName(""); // Reset city when province changes
      onChange({ province: match.name, city: "" });
    } else {
      setSelectedProvinceId("");
      setSelectedProvinceName("");
      setSelectedCityName("");
      onChange({ province: "", city: "" });
    }
  };

  // Handle manual city selection change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCityName(cityName);
    onChange({ province: selectedProvinceName, city: cityName });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Province Select */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Province
        </label>
        <div className="relative">
          {errorProvinces ? (
            <div className="flex items-center space-x-2 text-xs text-danger py-2">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to load provinces.</span>
              <button
                type="button"
                onClick={() => refetchProvinces()}
                className="underline hover:text-danger/80"
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              value={selectedProvinceId}
              onChange={handleProvinceChange}
              disabled={disabled || isLoadingProvinces}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue disabled:opacity-50 disabled:bg-surface-soft ${
                provinceError ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
              }`}
            >
              <option value="">
                {isLoadingProvinces ? "Loading provinces..." : "Select Province"}
              </option>
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          )}
          {isLoadingProvinces && (
            <span className="absolute right-3 top-2.5">
              <Loader2 className="w-4 h-4 text-silver animate-spin" />
            </span>
          )}
        </div>
        {provinceError && (
          <p className="mt-1 text-xs text-danger font-medium">{provinceError}</p>
        )}
      </div>

      {/* City Select */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          City / Kabupaten
        </label>
        <div className="relative">
          {errorCities ? (
            <div className="flex items-center space-x-2 text-xs text-danger py-2">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to load cities.</span>
              <button
                type="button"
                onClick={() => refetchCities()}
                className="underline hover:text-danger/80"
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              value={selectedCityName}
              onChange={handleCityChange}
              disabled={disabled || isLoadingCities || !selectedProvinceId}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue disabled:opacity-50 disabled:bg-surface-soft ${
                cityError ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
              }`}
            >
              <option value="">
                {isLoadingCities
                  ? "Loading cities..."
                  : !selectedProvinceId
                  ? "Select Province First"
                  : "Select City"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          )}
          {isLoadingCities && (
            <span className="absolute right-3 top-2.5">
              <Loader2 className="w-4 h-4 text-silver animate-spin" />
            </span>
          )}
        </div>
        {cityError && (
          <p className="mt-1 text-xs text-danger font-medium">{cityError}</p>
        )}
      </div>
    </div>
  );
}
