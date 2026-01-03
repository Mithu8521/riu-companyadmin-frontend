import { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { FiUpload, FiEdit, FiX, FiAlertTriangle } from "react-icons/fi";
import EmissionCalculationResults from "./EmissionCalculationResults";
import {
  FinancialYearField,
  LocationField,
  PeriodField,
  CategoryFieldEnhanced,
  createSearchableSelectProps
} from "../../common/FormComponents";
import SearchableSelect from "../../utils/SearchableSelect";
import { getStartingMonth, handlePeriodChange } from "../../utils/PeriodCalculationUtils";


const EmissionEntryForm = ({
  entry,
  index,
  handleSubmitData: parentHandleSubmitData,
  locationOptions,
  timePeriodOptions,
  emissionEntries,
  categories,
  financialYearOptions,
  selectedFinancialYear,
  setSelectedFinancialYear,
  scopeData,
  ghgProtocol,
  selectedScope = "SCOPE1", // Add selectedScope prop
  scope3Categories,
  identifier
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedScope3Category, setSelectedScope3Category] = useState("");
  const [selectedDefraScope3ActivityType, setSelectedDefraScope3ActivityType] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [formData, setFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);

  const existingEntries = emissionEntries;

  // Extract current entry data properly
  const currentEntry = useMemo(() => {
    if(!entry) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }

    return entry;
  }, [entry]);

  // Get available subcategories for SCOPE2
  const getScope2Categories = useCallback(() => {
    if (selectedScope !== "SCOPE2" || !scopeData) return [];

    const scope2CategoryKey = Object.keys(scopeData)[0];
    const categoryData = scopeData[scope2CategoryKey]?.[ghgProtocol];

    if (!categoryData?.frontendFields) return [];

    return Object.keys(categoryData.frontendFields).map((subCategoryKey) => ({
      id: subCategoryKey,
      label:
        categoryData.frontendFields[subCategoryKey]?.name || subCategoryKey,
      data: categoryData.data[subCategoryKey],
      frontendFields: categoryData.frontendFields[subCategoryKey],
      dependencyTree: categoryData.dependencyTrees?.[subCategoryKey],
    }));
  }, [selectedScope, scopeData, ghgProtocol]);

  // FIXED: Better initialization of form data with proper dependency handling
  useEffect(() => {
    if (currentEntry) {
      // For existing entries, populate formData with saved values
      setSelectedLocation(currentEntry.sourceId);
      setSelectedPeriod(currentEntry.period);
      setFormData(currentEntry.inputDetails.formData);
      setSelectedCategory(currentEntry.inputDetails.category);
      setSelectedMethod(currentEntry.inputDetails.method);
      setSelectedScope3Category(currentEntry.inputDetails.scope3CategoryId);
      setSelectedDefraScope3ActivityType(currentEntry.inputDetails.defraScope3ActivityType);
      handlePeriodChange(
        currentEntry.period, 
        selectedFinancialYear, 
        financialYearOptions, 
        identifier,
        setFromDate,
        setToDate,
        getStartingMonth()
      )
    } else {
      // For new entries, start with empty form
      setSelectedLocation();
      setSelectedPeriod();
      setFormData({});
      setSelectedCategory("");
      setSelectedMethod("");
      setSelectedScope3Category("");
      setSelectedDefraScope3ActivityType("");
    }
  }, [
    currentEntry,
    selectedScope,
    scopeData
  ]);

  // FIXED: Force re-render when formData changes to update dependent dropdowns
  useEffect(() => {
    // This effect ensures that when formData changes, components re-render
    // and dependent fields get their options recalculated
    console.log("Form data changed:", formData);
  }, [formData]);

  // Get methods for selected category (handles both SCOPE1 and SCOPE2)
  const availableMethods = useMemo(() => {

    if (selectedScope === "SCOPE1") {
      if (!selectedCategory || !scopeData?.[selectedCategory]) return [];

      const categoryData = scopeData[selectedCategory][ghgProtocol];

      if (
        (selectedCategory === "mobile" || selectedCategory === "fugitive") &&
        categoryData.data &&
        typeof categoryData.data === "object"
      ) {

        let allowedMethodKeys = [];
        if (selectedCategory === "mobile") {
          allowedMethodKeys = [
            "fuel_use",
            "distance",
            "freight",
            "public_transport",
          ];
        } else if (selectedCategory === 'fugitive') {
          allowedMethodKeys = [
            "mass_balance",
            "topup",
          ];
        }

        return Object.keys(categoryData.data)
          .filter((methodKey) => allowedMethodKeys.includes(methodKey))
          .map((methodKey) => ({
            id: methodKey,
            label: methodKey
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            data: categoryData.data[methodKey],
          }));
      }

      return [
        {
          id: ghgProtocol,
          label: categoryData.frontendFields?.name || "IPCC",
          data: categoryData,
        },
      ];
    } else if (selectedScope === "SCOPE2") {
      const categories = getScope2Categories();
      if (categories.length > 1) {
        return categories;
      } else if (categories.length === 1) {
        setSelectedCategory(categories[0].id);
        return [];
      }
    }

    return [];
  }, [
    selectedScope,
    selectedCategory,
    scopeData,
    getScope2Categories
  ]);

  const getScope3CategoryOptions = () => {
    if (selectedScope !== 'SCOPE3') return [];

    const defraScope3Data = scopeData?.scope3?.defra?.data || {};
    const scope3CategoryOptions = Object.keys(defraScope3Data).map((categoryId) => ({
      id: categoryId,
      label: `${scope3Categories[categoryId]['name']} (Category ${scope3Categories[categoryId]['category_number']})`,
      activityTypes: Object.keys(defraScope3Data[categoryId] || {})
    }));

    return scope3CategoryOptions;
  };

  const getDefraScope3ActivityTypeOptions = () => {
    if (selectedScope !== 'SCOPE3' || !selectedScope3Category) return [];

    const defraScope3Data = scopeData?.scope3?.defra?.data || {};
    const categoryData = defraScope3Data[selectedScope3Category];
    if (!categoryData) return [];

    return Object.keys(categoryData).map((activityType) => ({
      id: activityType,
      label: activityType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    }));
  };

  const getScope3Record = (formData, frontendFields = [], dependencyTree = {}) => {
    if (!formData || !frontendFields.length || !dependencyTree) return null;

    let currentNode = dependencyTree;

    for (const field of frontendFields) {
      if (field.type !== 'dropdown') continue;

      const selectedValue = formData[field.name];
      if (!selectedValue || !currentNode[selectedValue]) {
        return null; // Incomplete selection path
      }

      currentNode = currentNode[selectedValue];
    }

    // Reached the leaf node (should be a full record)
    return typeof currentNode === 'object' && !Array.isArray(currentNode)
      ? currentNode
      : null;
  };

  const getRecord = (formData) => {
    try {
      let dataSource;
      let records = [];

      if (selectedScope === "SCOPE1") {
        if (selectedCategory === "mobile" && selectedMethod) {
          dataSource = scopeData?.[selectedCategory]?.[ghgProtocol]?.data?.[selectedMethod];
          if (selectedMethod === "fuel_use" && dataSource?.data) {
            const fuelUseCategory = formData?.fuelUseCategory;
            if (fuelUseCategory && dataSource.data[fuelUseCategory]?.records) {
              records = dataSource.data[fuelUseCategory].records;
            }
          } else if (dataSource?.records) {
            records = dataSource.records;
          }
        } else if (selectedCategory === "fugitive" && selectedMethod) {
          dataSource = scopeData?.[selectedCategory]?.[ghgProtocol]?.data?.[selectedMethod];
          records = dataSource.records;
        } else {
          dataSource = scopeData?.[selectedCategory]?.[ghgProtocol];
          if (dataSource?.data?.flatRecords) {
            records = dataSource.data.flatRecords;
          } else if (Array.isArray(dataSource?.data)) {
            records = dataSource.data;
          }
        }
      } else if (selectedScope === "SCOPE2") {
        const scope2CategoryKey = Object.keys(scopeData)[0];
        const categoryData = scopeData?.[scope2CategoryKey]?.[ghgProtocol];

        if (selectedCategory) {
          const subCategoryData = categoryData?.data?.[selectedCategory];
          if (subCategoryData?.flatRecords) {
            records = subCategoryData.flatRecords;
          } else if (subCategoryData?.groupedByActivity) {
            records = [];
            Object.values(subCategoryData.groupedByActivity).forEach((group) => {
              if (group.records) records.push(...group.records);
            });
          }
        }
      }

      if (!records || records.length === 0){
        throw new Error('No emission factors found.');
      };

      // Fetch frontendFields
      let frontendFields = [];
      if (selectedScope === "SCOPE1") {
        if ((selectedCategory === "mobile" || selectedCategory === "fugitive") && selectedMethod) {
          frontendFields = scopeData?.[selectedCategory]?.[ghgProtocol]?.data?.[selectedMethod]?.frontendFields?.fields || [];
        } else {
          frontendFields = scopeData?.[selectedCategory]?.[ghgProtocol]?.frontendFields?.fields || [];
        }
      } else if (selectedScope === "SCOPE2") {
        const scope2CategoryKey = Object.keys(scopeData)[0];
        const categoryData = scopeData?.[scope2CategoryKey]?.[ghgProtocol];
        if (selectedCategory) {
          frontendFields = categoryData?.frontendFields?.[selectedCategory]?.fields || [];
        } 
      }

      // Build a map from frontendFields for quick lookup
      const frontendFieldMap = {};
      frontendFields.forEach(f => {
        frontendFieldMap[f.name] = f;
      });

      // Build filterableData from formData
      const filterableData = Object.entries(formData || {})
        .filter(([key, value]) => {
          if (!value || value === "") return false;
          const fieldConfig = frontendFieldMap[key];
          return fieldConfig && fieldConfig.type === "dropdown";
        })
        .map(([key, value]) => {
          const fieldConfig = frontendFieldMap[key];
          return {
            fieldName: key,
            backendField: fieldConfig.backendField || key,
            value: value
          };
        });

      // If no filterable fields, return null
      if (filterableData.length === 0){
        throw new Error('No form data available.');
      }

      // Filter records using filterableData
      let filteredRecords = records.filter((record) => {
        return filterableData.every(({ backendField, value }) => {
          return String(record[backendField]) === String(value);
        });
      });

      if (filteredRecords.length === 0) {
        throw new Error('No emission factors found.');
      }

      if (filteredRecords.length > 1) {
        throw new Error("More than one matching emission factor found. Please refine the inputs.");
      }

      // Return the single matching record
      return filteredRecords[0];
      
    } catch (error) {
      console.error("Error getting emission factor:", error);
      return null;
    }
  };


  // Get form fields dynamically based on selected category, method, and subcategory
  const formFields = useMemo(() => {
    if (selectedScope === "SCOPE1") {
      if (!selectedCategory || !scopeData?.[selectedCategory]) return [];

      let fieldsData;
      
      if ((selectedCategory === "mobile" || selectedCategory === "fugitive") && selectedMethod) {
        fieldsData =
          scopeData[selectedCategory][ghgProtocol].data[selectedMethod]
            ?.frontendFields;
      } else {
        fieldsData = scopeData[selectedCategory][ghgProtocol].frontendFields;
      }

      return fieldsData?.fields || [];
    } else if (selectedScope === "SCOPE2") {
      if (!scopeData) return [];

      const scope2CategoryKey = Object.keys(scopeData)[0];
      const categoryData = scopeData[scope2CategoryKey]?.[ghgProtocol];

      if (!categoryData) return [];

      let fieldsData;

      if (selectedCategory) {
        fieldsData = categoryData.frontendFields?.[selectedCategory];
      }

      return fieldsData?.fields || [];
    } else if (selectedScope === 'SCOPE3') {
      if (!selectedScope3Category || !selectedDefraScope3ActivityType) return [];

      const defraScope3Data = scopeData?.scope3?.defra?.data || {};
      const activityData = defraScope3Data[selectedScope3Category]?.[selectedDefraScope3ActivityType];
      return activityData?.frontendFields?.fields || [];
    }

    return [];
  }, [
    selectedScope,
    selectedCategory,
    selectedMethod,
    scopeData,
    selectedScope3Category,
    selectedDefraScope3ActivityType,
  ]);

  // Get dependency tree for dropdown options
  const getDependencyTree = useCallback(() => {

    if (selectedScope === "SCOPE1") {
      if (!selectedCategory || !scopeData?.[selectedCategory]) return null;

      const categoryData = scopeData[selectedCategory][ghgProtocol];
      

      if ((selectedCategory === "mobile" || selectedCategory === "fugitive") && selectedMethod) {
        return categoryData.data[selectedMethod]?.dependencyTree;
      } else {
        return categoryData.dependencyTree;
      }
    } else if (selectedScope === "SCOPE2") {
      if (!scopeData) return null;

      const scope2CategoryKey = Object.keys(scopeData)[0];
      const categoryData = scopeData[scope2CategoryKey]?.[ghgProtocol];

      if (!categoryData) return null;

      if (selectedCategory) {
        return categoryData.dependencyTrees?.[selectedCategory];
      }
    } else if (selectedScope === 'SCOPE3') {
      return scopeData?.scope3?.defra?.data?.[selectedScope3Category]?.[selectedDefraScope3ActivityType]?.dependencyTree;
    }

    return null;
  }, [
    selectedScope,
    selectedCategory,
    selectedMethod,
    scopeData,
    selectedScope3Category,
    selectedDefraScope3ActivityType,
    getScope2Categories,
  ]);


  const traverseNestedTree = (tree, fieldConfig) => {
    let currentNode = tree;
    for (const field of formFields) {
      if (field.name === fieldConfig.name) break;
      const selectedVal = formData[field.name];
      if (selectedVal && currentNode && currentNode[selectedVal]) {
        currentNode = currentNode[selectedVal];
      } else {
        return [];
      }
    }
    return currentNode;
  };

  // Get dropdown options using the backend dependency tree
  const getDropdownOptions = useCallback(
    (fieldName) => {
      const dependencyTree = getDependencyTree();
      if (!dependencyTree) return [];

      const fieldConfig = formFields.find((f) => f.name === fieldName);
      if (!fieldConfig) return [];

      // ✅ SCOPE3: Traverse deeply based on formData
      if (selectedScope === "SCOPE3") {
        let currentNode = dependencyTree;
        for (const field of formFields) {
          if (field.name === fieldName) break;

          if (field.type !== 'dropdown') continue;

          const selectedVal = formData[field.name];
          if (!selectedVal || !currentNode[selectedVal]) {
            return [];
          }

          currentNode = currentNode[selectedVal];
        }

        // Now currentNode is either:
        // - an object with options (next field values)
        // - a full record if it's the last field

        if (typeof currentNode === "object" && !Array.isArray(currentNode)) {
          const keys = Object.keys(currentNode);
          return keys.map((value) => ({ value, label: value }));
        }

        return [];
      }

      // ✅ SCOPE1/SCOPE2: Keep existing flat logic
      const fieldOptions = dependencyTree[fieldName];
      if (
        fieldConfig?.dependsOn &&
        typeof fieldOptions === "object" &&
        !Array.isArray(fieldOptions)
      ) {
        const parentValue = formData[fieldConfig.dependsOn];

        if (!parentValue) {
          return [];
        }

        const options = fieldOptions[parentValue] || [];

        return options.map((value) => ({
          value,
          label: value,
        }));
      } else if (Array.isArray(fieldOptions)) {
        return fieldOptions.map((value) => ({ value, label: value }));
      }

      return [];
    },
    [
      selectedScope,
      selectedCategory,
      getDependencyTree,
      formFields,
      formData,
    ]
  );

  // Enhanced unit options handling for all complex cases
  const getAvailableUnits = useCallback(() => {
    const unitOptions = getDropdownOptions("unit");
    if (unitOptions.length > 0) {
      return unitOptions;
    }

    const dependencyTree = getDependencyTree();
    if (!dependencyTree) return [];

    if (
      selectedScope === "SCOPE1" &&
      selectedCategory === "mobile" &&
      selectedMethod === "freight"
    ) {
      const fuelValue = formData.fuel;
      if (fuelValue) {
        if (dependencyTree.weightUnit && dependencyTree.weightUnit[fuelValue]) {
          return dependencyTree.weightUnit[fuelValue].map((value) => ({
            value,
            label: value,
          }));
        }
        if (
          dependencyTree.distanceUnit &&
          dependencyTree.distanceUnit[fuelValue]
        ) {
          return dependencyTree.distanceUnit[fuelValue].map((value) => ({
            value,
            label: value,
          }));
        }
      }
    }

    if (selectedScope === "SCOPE1" && selectedCategory === "fugitive") {
      const refrigerantValue = formData.refrigerant;
      if (refrigerantValue && dependencyTree) {
        const unitField = formFields.find((f) => f.name.includes("Unit"));
        if (unitField) {
          const unitTreeKey = unitField.name;
          if (
            dependencyTree[unitTreeKey] &&
            dependencyTree[unitTreeKey][refrigerantValue]
          ) {
            return dependencyTree[unitTreeKey][refrigerantValue].map(
              (value) => ({
                value,
                label: value,
              })
            );
          }
        }
      }
    }

    if (selectedScope === 'SCOPE3') {
      const dependencyTree = getDependencyTree();
      const unitField = formFields.find((f) => f.name === 'unit');

      // Traverse to final record using current formData
      let currentNode = dependencyTree;
      for (const field of formFields) {
        const val = formData[field.name];
        if (!val || !currentNode[val]) {
          currentNode = null;
          break;
        }
        currentNode = currentNode[val];
      }

      if (currentNode && typeof currentNode === "object" && !Array.isArray(currentNode)) {
        const unit = currentNode?.unit || currentNode?.Unit;
        if (unit) {
          return [{ value: unit, label: unit }];
        }
      }

      return [];
    }

    // Fallback to direct data filtering
    return getDropdownOptionsFallback("unit");
  }, [
    selectedScope,
    selectedCategory,
    selectedMethod,
    formData,
    formFields,
    formData.fuel,
    formData.refrigerant,
    getDropdownOptions,
    getDependencyTree,
  ]);

  // Fallback method for getting options directly from data
  const getDropdownOptionsFallback = useCallback(
    (fieldName) => {

      if (selectedScope === "SCOPE1") {
        if (!selectedCategory || !scopeData?.[selectedCategory]) return [];

        let dataSource;
        
        const categoryData = scopeData[selectedCategory][ghgProtocol];

        if ((selectedCategory === "mobile" || selectedCategory === "fugitive") && selectedMethod) {
          dataSource =
            categoryData.data[selectedMethod]?.records ||
            categoryData.data[selectedMethod]?.data;
        } else {
          dataSource = categoryData.data;
        }

        if (!Array.isArray(dataSource)) {
          if (dataSource && typeof dataSource === "object") {
            const allRecords = [];
            Object.values(dataSource).forEach((subData) => {
              if (subData.records) {
                allRecords.push(...subData.records);
              } else if (Array.isArray(subData)) {
                allRecords.push(...subData);
              }
            });
            dataSource = allRecords;
          } else {
            return [];
          }
        }

        let filteredData = dataSource;
        const fieldConfig = formFields.find((f) => f.name === fieldName);
        const backendFieldName = fieldConfig?.backendField || fieldName;

        formFields.forEach((field) => {
          const formValue = formData[field.name];
          if (formValue && field.backendField) {
            filteredData = filteredData.filter(
              (item) => item[field.backendField] === formValue
            );
          }
        });

        const uniqueValues = [
          ...new Set(
            filteredData
              .map((item) => item[backendFieldName])
              .filter(
                (value) => value !== null && value !== undefined && value !== ""
              )
          ),
        ];

        return uniqueValues.map((value) => ({ value, label: value }));
      } else if (selectedScope === "SCOPE2") {
        if (!scopeData) return [];

        const scope2CategoryKey = Object.keys(scopeData)[0];
        const categoryData = scopeData[scope2CategoryKey]?.[ghgProtocol];

        if (!categoryData) return [];

        let dataSource;
        if (selectedCategory) {
          dataSource =
            categoryData.data[selectedCategory]?.flatRecords ||
            categoryData.data[selectedCategory]?.groupedByActivity;
        }

        if (!Array.isArray(dataSource)) {
          if (dataSource && typeof dataSource === "object") {
            const allRecords = [];
            Object.values(dataSource).forEach((subData) => {
              if (subData.records) {
                allRecords.push(...subData.records);
              } else if (Array.isArray(subData)) {
                allRecords.push(...subData);
              }
            });
            dataSource = allRecords;
          } else {
            return [];
          }
        }

        let filteredData = dataSource;
        const fieldConfig = formFields.find((f) => f.name === fieldName);
        const backendFieldName = fieldConfig?.backendField || fieldName;

        formFields.forEach((field) => {
          const formValue = formData[field.name];
          if (formValue && field.backendField) {
            filteredData = filteredData.filter(
              (item) => item[field.backendField] === formValue
            );
          }
        });

        const uniqueValues = [
          ...new Set(
            filteredData
              .map((item) => item[backendFieldName])
              .filter(
                (value) => value !== null && value !== undefined && value !== ""
              )
          ),
        ];

        return uniqueValues.map((value) => ({ value, label: value }));
      }

      return [];
    },
    [
      selectedScope,
      selectedCategory,
      selectedMethod,
      currentEntry,
      scopeData,
      formFields,
      formData,
      getScope2Categories,
    ]
  );

  // Check if field should be shown based on showWhen condition
  const shouldShowField = useCallback((field, currentFormData) => {
    if (!field.showWhen) return true;

    return Object.entries(field.showWhen).every(([key, value]) => {
      return currentFormData[key] === value;
    });
  }, []);

  // FIXED: Improved updateFormData function with better dependency handling and cascading
  const updateFormData = useCallback(
    (key, value) => {
      setFormData((prev) => {
        const newFormData = { ...prev, [key]: value };

        // Function to recursively clear dependent fields
        const clearDependentFields = (parentFieldName, dataToUpdate) => {
          formFields.forEach((field) => {
            if (field.dependsOn === parentFieldName) {
              dataToUpdate[field.name] = "";
              // Recursively clear fields that depend on this field
              clearDependentFields(field.name, dataToUpdate);
            }
          });
        };

        // Clear all dependent fields when parent field changes
        clearDependentFields(key, newFormData);

        return newFormData;
      });
    }, [formFields]
  );

  // Function to check for duplicate entries
  const isDuplicateEntry = useCallback(
    () => {
      if (!isEditable) return false;
      if (!existingEntries || existingEntries.length === 0) return false;
      if (!formData) return false;

      const duplicate = existingEntries.find((existing) => {
          const isDuplicateForm = (Object.keys(existing?.inputDetails?.formData)?.length === Object.keys(formData)?.length &&
            Object.entries(existing.inputDetails.formData).every(([key, value]) => ((!currentEntry && key === 'activityAmount') || formData?.[key] === value)));

          return (selectedFinancialYear === existing?.financialYearId && 
            selectedLocation === existing?.sourceId &&
            selectedPeriod === existing?.period &&
            selectedCategory === existing?.inputDetails?.category &&
            selectedMethod === existing?.inputDetails?.method &&
            selectedScope3Category === existing?.inputDetails?.scope3CategoryId && 
            selectedDefraScope3ActivityType === existing?.inputDetails?.defraScope3ActivityType &&
            isDuplicateForm
          )
      });
      return duplicate;
    },
    [
      isEditable,
      existingEntries, 
      formData, 
      selectedFinancialYear, 
      selectedLocation, 
      selectedPeriod, 
      selectedCategory, 
      selectedMethod,
      selectedScope3Category,
      selectedDefraScope3ActivityType
    ]
  );

  const isDuplicate = useMemo(() => isDuplicateEntry(), [isDuplicateEntry]);

  const scopeRecord = useMemo(() => {
    if (selectedScope !== 'SCOPE3') {
      return getRecord(formData);
    } else {
      return getScope3Record(formData, formFields, getDependencyTree());
    }
  }, [
    scopeData,
    formData, 
    formFields,
    ghgProtocol,
    selectedScope, 
    selectedCategory, 
    selectedMethod,
    getDependencyTree
  ]);

  const handleSubmit = async () => {
    if (!parentHandleSubmitData || !isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const inputDetails = {
        formData: formData,
        record: scopeRecord,
        scope3CategoryId: selectedScope3Category,
        defraScope3ActivityType: selectedDefraScope3ActivityType,
        category: selectedCategory,
        method: selectedMethod,
      };

      const entryData = {
        id: currentEntry ? currentEntry.id : undefined,
        sourceId: selectedLocation,
        subLocationId: undefined,
        fromDate: fromDate,
        toDate: toDate,
        scope: selectedScope,
        financialYearId: selectedFinancialYear,
        ghgDatabaseId: scopeRecord.ghgDatabaseId,
        // TODO: Find the mathced questionId based on framework.
        questionId: typeof scopeRecord.questionIds !== 'string' ? undefined : scopeRecord.questionIds,
        inputDetails: inputDetails 
      };

      const success = await parentHandleSubmitData(entryData);

      if (success !== false) {
        setFormData({});
        return true;
      }

      return false;
    } catch (error) {
      setSubmitError(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormWithRows = (fields) => {
    const fieldsByRow = fields.reduce((acc, field) => {
      if (shouldShowField(field, formData)) {
        const rowNum = field.rowNumber || 1;
        if (!acc[rowNum]) {
          acc[rowNum] = [];
        }
        acc[rowNum].push(field);
      }
      return acc;
    }, {});

    return Object.keys(fieldsByRow)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((rowNumber) => (
        <Row key={`row-${rowNumber}`} className="g-4 mt-2">
          {fieldsByRow[rowNumber].map((field) => renderFormField(field))}
        </Row>
      ));
  };

  const renderFormField = useCallback(
    (field) => {
      let value = "", isDisabled, dependentValue = null;

      if (selectedScope === 'SCOPE3') {
        // formData is already set to inputDetails in the beginning so no need to fallback to inputDetails
        value = formData[field.name] || "";
        isDisabled = field.dependsOn && !formData[field.dependsOn];
      } else  {
        value = formData[field.name];

        // FIXED: Better dependency checking - check all possible sources
        dependentValue = formData[field.dependsOn];

        isDisabled = field.dependsOn && !dependentValue;
      }

      // Check if field should be shown
      if (
        !shouldShowField(field, formData)
      ) {
        return null;
      }

      // Helper function to format number in Indian style
      const formatIndianNumber = (num) => {
        if (!num || num === "") return "";

        const numStr = num.toString().replace(/,/g, "");

        if (isNaN(numStr)) return num;

        const parts = numStr.split(".");
        const integerPart = parts[0];
        const decimalPart = parts[1];

        let formatted = "";
        const len = integerPart.length;

        if (len <= 3) {
          formatted = integerPart;
        } else {
          formatted = integerPart.slice(-3);
          let remaining = integerPart.slice(0, -3);

          while (remaining.length > 0) {
            if (remaining.length <= 2) {
              formatted = remaining + "," + formatted;
              break;
            } else {
              formatted = remaining.slice(-2) + "," + formatted;
              remaining = remaining.slice(0, -2);
            }
          }
        }

        if (decimalPart !== undefined) {
          formatted += "." + decimalPart;
        }

        return formatted;
      };

      const removeFormatting = (formattedValue) => {
        return formattedValue.replace(/,/g, "");
      };

      const commonStyle = {
        borderRadius: "8px",
        fontSize: "0.9rem",
        height: "44px",
        backgroundColor: !isEditable || isDisabled ? "#f8fafc" : "white",
        cursor: !isEditable || isDisabled ? "not-allowed" : "pointer",
        opacity: !isEditable || isDisabled ? 0.6 : 1,
      };

      switch (field.type) {
        case "dropdown":
          let options = field.options || [];

          // Get options based on field dependencies
          if (selectedScope !== "SCOPE3" && !field.options) {
            if (
              field.name === "unit" ||
              field.name.includes("Unit") ||
              field.name === "weightUnit" ||
              field.name === "distanceUnit" ||
              field.name === "initialQuantityUnit" ||
              field.name === "quantityPurchasedUnit" ||
              field.name === "quantityRecoveredUnit"
            ) {
              options = getAvailableUnits();
            } else if (field.dependsOn) {
              // FIXED: Better dependency checking with real-time value lookup
              if (dependentValue) {
                options = getDropdownOptions(field.name);
              } else {
                options = [];
                // FIXED: If no dependent value, ensure the field value is empty
                if (value && isEditable) {
                  updateFormData(field.name, "");
                  value = "";
                }
              }
            } else {
              options = getDropdownOptions(field.name);
            }
          }

          if (selectedScope === "SCOPE3" && !field.options) {
            options = getDropdownOptions(field.name);

            // Special case: no options available + this is the last dropdown → use backendField from record
            if (!options.length) {
              const fieldIndex = formFields.findIndex((f) => f.name === field.name);
              const isLastDropdown = formFields
                .slice(fieldIndex + 1)
                .every((f) => f.type !== "dropdown");

              if (isLastDropdown) {
                const finalNode = traverseNestedTree(getDependencyTree(), field);
                const backendField = field.backendField || field.name;
                const finalValue = finalNode?.[backendField];
                if (finalValue) {
                  options = [{ value: finalValue, label: finalValue }];
                }
              }
            }
          }

          const isFieldDisabled = !isEditable || isDisabled;
          const selectCommonStyle = {
            ...commonStyle,
            backgroundColor: !isEditable || isDisabled ? "#fee2e2" : "white",
            cursor: !isEditable || isDisabled ? "not-allowed" : "pointer",
          };
          return (
            <SearchableSelect
              key={`${field.name}-${dependentValue || "empty"}-${value}-${
                  options.length
                }`} // FIXED: Include value and options count in key
              field={field}
              value={value}
              options={options}
              isDisabled={isFieldDisabled}
              updateFormData={updateFormData}
              formFields={formFields}
              commonStyle={selectCommonStyle}
              width={6}
            />
          );


        case "number":
          return (
            <Col md={6} key={field.name}>
              <Form.Group>
                <Form.Label
                  className="fw-semibold mb-2 d-flex align-items-center"
                  style={{ color: "#1e293b", fontSize: "0.9rem" }}
                >
                  <div
                    className="rounded-circle me-2"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#8b5cf6",
                    }}
                  ></div>
                  {field.label} {field.required && "*"}
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    step="any"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formatIndianNumber(value)}
                    onChange={(e) => {
                      const cleanValue = removeFormatting(e.target.value);

                      if (cleanValue === "" || /^\d*\.?\d*$/.test(cleanValue)) {
                        updateFormData(field.name, cleanValue);
                      }
                    }}
                    onBlur={(e) => {
                      const cleanValue = removeFormatting(e.target.value);
                      if (cleanValue && !isNaN(cleanValue)) {
                        updateFormData(field.name, cleanValue);
                      }
                    }}
                    disabled={
                      !isEditable ||
                      isDisabled
                    }
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      ...commonStyle,
                      backgroundColor:
                        !isEditable ||
                        isDisabled
                          ? "rgb(233, 236, 239)"
                          : "white",
                      cursor:
                        !isEditable ||
                        isDisabled
                          ? "not-allowed"
                          : "text",
                    }}
                  />
                </div>
              </Form.Group>
            </Col>
          );

        default:
          return (
            <Col md={6} key={field.name}>
              <Form.Group>
                <Form.Label
                  className="fw-semibold mb-2 d-flex align-items-center"
                  style={{ color: "#1e293b", fontSize: "0.9rem" }}
                >
                  <div
                    className="rounded-circle me-2"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#64748b",
                    }}
                  ></div>
                  {field.label} {field.required && "*"}
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={value}
                    onChange={(e) => updateFormData(field.name, e.target.value)}
                    disabled={
                      !isEditable ||
                      isDisabled
                    }
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      ...commonStyle,
                      backgroundColor:
                        !isEditable ||
                        isDisabled
                          ? "#fee2e2"
                          : "white",
                      cursor:
                        !isEditable ||
                        isDisabled
                          ? "not-allowed"
                          : "text",
                    }}
                  />
                </div>
              </Form.Group>
            </Col>
          );
      }
    },
    [
      formData,
      currentEntry,
      shouldShowField,
      formFields,
      getAvailableUnits,
      getDropdownOptions,
      updateFormData,
      isEditable,
    ]
  );

  const isFormValid = useMemo(() => {
    const isValid = selectedLocation &&
        selectedPeriod && 
        !isDuplicate &&
        formData &&
        scopeRecord &&
        calculationResults;

    if (selectedScope === "SCOPE1") {
      return isValid && selectedCategory;
    } else if (selectedScope === "SCOPE2") {
      const subCategories = getScope2Categories();
      return isValid && (subCategories.length <= 1 || selectedCategory);
    } else if (selectedScope === 'SCOPE3') {
      return isValid && selectedScope3Category && selectedDefraScope3ActivityType;
    }

    return false;
  }, [
    ghgProtocol,
    selectedScope,
    selectedLocation,
    selectedPeriod,
    selectedCategory,
    selectedMethod,
    isDuplicate,
    getScope2Categories,
    selectedScope3Category,
    selectedDefraScope3ActivityType,
    formData,
    scopeRecord
  ]);

  return (
    <>

    <div
      className="mb-4 p-4 rounded-lg"
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      {submitError && (
        <Alert
          variant="danger"
          className="mb-3"
          dismissible
          onClose={() => setSubmitError(null)}
        >
          {submitError}
        </Alert>
      )}

      {/* Header */}
      {currentEntry && 
      (<div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-dark" style={{ fontWeight: "600" }}>
          {`${selectedScope?.toUpperCase()} Entry #${index}`}
        </h6>
        <div className="d-flex gap-2">
          <button
            onClick={() => {
              setSubmitError(null);

              setIsEditable((prev) => {
                const newEditable = !prev;

                if (!newEditable) {
                  // Reset form data when canceling edit
                  setFormData(currentEntry?.inputDetails.formData);
                  setSelectedFinancialYear(String(currentEntry.financialYearId));
                  setSelectedLocation(String(currentEntry.sourceId));
                  setSelectedPeriod(String(currentEntry.period));
                  setSelectedCategory(currentEntry.inputDetails.category);
                  setSelectedMethod(currentEntry.inputDetails.method);
                  setSelectedScope3Category(currentEntry.inputDetails.scope3CategoryId);
                  setSelectedDefraScope3ActivityType(currentEntry.inputDetails.defraScope3ActivityType);
                }

                return newEditable;
              });
            }}
            className={`btn d-flex align-items-center justify-content-center`}
            style={{
              borderRadius: "6px",
              padding: "4px 16px",
              fontWeight: "500",
              height: "32px",
              fontSize: "0.85rem",
              minWidth: "110px",
              border:
                isEditable
                  ? "1px solid #dc3545"
                  : "1px solid #e2e6ea",
              backgroundColor:
                isEditable ? "#fff5f5" : "#fff",
              color: isEditable ? "#dc3545" : "#666",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
            disabled={isSubmitting}
          >
            {isEditable ? (
              <>
                <FiX className="me-1" size={14} />
                Cancel
              </>
            ) : (
              <>
                <FiEdit className="me-1" size={14} />
                Edit
              </>
            )}
          </button>
          {isEditable && (
            <button
              className="btn d-flex align-items-center justify-content-center"
              style={{
                borderRadius: "6px",
                padding: "4px 16px",
                fontWeight: "500",
                height: "32px",
                fontSize: "0.85rem",
                minWidth: "110px",
                backgroundColor: "#10b981",
                border: "none",
                color: "#fff",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiUpload className="me-1" size={14} />
                  Update
                </>
              )}
            </button>
          )}
        </div>
      </div>)}

      {/* Basic Information Section */}
      <div className="mb-4">
        <h6 style={{ color: "#374151", fontWeight: "600" }}>
          Basic Information
        </h6>
        <div className="d-flex flex-nowrap gap-3 mb-3">
          <div className="flex-fill">
            <FinancialYearField
              value={selectedFinancialYear}
              onChange={setSelectedFinancialYear}
              options={financialYearOptions}
              required={true}
              disabled={!isEditable}
            />
          </div>

          <div className="flex-fill">
            <LocationField
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={locationOptions}
              required={true}
              disabled={!isEditable}
            />
          </div>

          <div className="flex-fill">
            <PeriodField
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={timePeriodOptions}
              required={true}
              onPeriodChange={(value) => handlePeriodChange(
                value, 
                selectedFinancialYear, 
                financialYearOptions, 
                identifier,
                setFromDate,
                setToDate,
                getStartingMonth()
              )}
              disabled={!isEditable}
            />
          </div>

          {selectedScope === "SCOPE1" && (
            <div className="flex-fill">
              <CategoryFieldEnhanced
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
                isEditable={isEditable}
                onCategoryChange={(selectedValue) => {
                  setSelectedMethod("");
                  setFormData({});
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Method/SubCategory Selection */}
      {((selectedScope === "SCOPE1" &&
        (selectedCategory === "mobile" || selectedCategory === "fugitive") &&
        availableMethods.length > 0) ||
        (selectedScope === "SCOPE2" && availableMethods.length > 0)) && (
        <div className="mb-4">
          {/* <h6 className="mb-3" style={{ color: "#374151", fontWeight: "600" }}>
            {selectedScope === "SCOPE1"
              ? "Method Selection"
              : "Category Selection"}
          </h6> */}
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <SearchableSelect {...createSearchableSelectProps(
                  selectedScope === "SCOPE1" ? "Method" : "Category",
                  selectedScope === "SCOPE1" ? selectedMethod : selectedCategory,
                  (val) => {
                    if (selectedScope === "SCOPE1") {
                      setSelectedMethod(val);
                    } else {
                      setSelectedCategory(val);
                    }
                    setFormData({});
                  },
                  availableMethods,
                  true,
                  !isEditable,
                  isEditable ? "white" : "#f8f9fa",
                  (option) => String(option.label),
                  (option) => String(option.id)
                )} />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}


      {selectedScope === 'SCOPE3' && (
        <div className="d-flex flex-nowrap gap-3 mb-3">

          <div className="flex-fill">
            <Col md={12}>
              <Form.Group>
                <SearchableSelect {...createSearchableSelectProps(
                  "Scope 3 Category",
                  selectedScope3Category,
                  (val) => {
                    setSelectedScope3Category(val);
                    setSelectedDefraScope3ActivityType("");
                    setFormData({});
                  },
                  getScope3CategoryOptions(),
                  true,
                  !isEditable,
                  "#0ea5e9",
                  (option) => option.label,
                  (option) => option.id
                )} />
              </Form.Group>
            </Col>
          </div>

          <div className="flex-fill">
            <Col md={12}>
              <Form.Group>
                <SearchableSelect {...createSearchableSelectProps(
                  "Activity Type",
                  selectedDefraScope3ActivityType,
                  (val) => {
                    setSelectedDefraScope3ActivityType(val);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      selectedDefraScope3ActivityType: val,
                    }));
                  },
                  getDefraScope3ActivityTypeOptions(),
                  true,
                  !isEditable,
                  "#0ea5e9",
                  (option) => option.label,
                  (option) => option.id
                )} />
              </Form.Group>
            </Col>
          </div>
        </div>
      )}

      {/* Dynamic Form Fields */}
      {formFields.length > 0 && (
        <div className="mb-2 mt-4">
          <h6 style={{ color: "#374151", fontWeight: "600" }}>
            Emission Details
          </h6>
          <div className="g-4">{renderFormWithRows(formFields)}</div>
        </div>
      )}

      {/* Calculation Results */}
      <div
        className="mt-5 p-4"
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          borderRadius: "16px",
          border: "2px solid #e0f2fe",
          boxShadow: "0 4px 6px -1px rgba(56, 189, 248, 0.1)",
        }}
      >
        <div className="d-flex align-items-center mb-3">
          <h4
            className="mb-0"
            style={{
              color: "#0c4a6e",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            Calculation Results
          </h4>
        </div>
        {(() => {
          const mergedFormData = !currentEntry ? formData : isEditable
            ? formData
            : currentEntry?.inputDetails.formData;

          const hasFormData = Object.keys(mergedFormData).length > 0;

          const mergedRecord = !currentEntry ? scopeRecord : isEditable 
            ? scopeRecord 
            : currentEntry?.inputDetails.record;

          if (!hasFormData) return <div>No form data available.</div>;

          return (
            <EmissionCalculationResults
              selectedScope={selectedScope}
              ghgProtocol={ghgProtocol}
              scopeData={scopeData}
              selectedCategory={selectedCategory}
              selectedMethod={selectedMethod}
              selectedScope3Category={selectedScope3Category}
              selectedDefraScope3ActivityType={selectedDefraScope3ActivityType}
              formData={mergedFormData}
              record={mergedRecord}
              calculationResults={calculationResults}
              setCalculationResults={setCalculationResults}
            />
          );
        })()}
      </div>
    </div>

    {!currentEntry && (
    <div className="d-flex gap-3 w-100 justify-content-end">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid || isDuplicate}
            style={{
              height: "52px",
              minWidth: "160px",
              padding: "0 28px",
              fontSize: "0.95rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              border: "none",
              borderRadius: "12px",
              background: isFormValid
                ? "linear-gradient(135deg, #3c8dbb, #7494a7)"
                : "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
              color: "white",
              boxShadow: isFormValid
                ? "0 8px 25px -5px rgba(102, 126, 234, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                : "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: isFormValid ? "pointer" : "not-allowed",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              if (isFormValid) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px -5px rgba(102, 126, 234, 0.6), 0 8px 10px -2px rgba(0, 0, 0, 0.1)";
              }
            }}
            onMouseOut={(e) => {
              if (isFormValid) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px -5px rgba(102, 126, 234, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }
            }}
          >
            {isDuplicate ? "Entry Already Exists" : "Save"}
          </Button>
        </div>
      )}
    </>
  );
};

export default EmissionEntryForm;
