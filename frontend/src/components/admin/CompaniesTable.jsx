import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate=useNavigate();

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);
  return (
    <>
      <Table>
        <TableCaption>A list of your recent registered companies.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>LOGO</TableHead>

            <TableHead>NAME</TableHead>

            <TableHead>DATE</TableHead>

            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length <= 0 ? (
            <span>You haven't registered any company yet.</span>
          ) : (
            <>
              {filterCompany?.map((company) => (
                // return (
                <tr key={company._id}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        className="w-full h-full object-cover"
                        src={company.logo}
                        alt="Company Logo"
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        <div 
                        onClick={()=>navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer">
                          <Edit2 className="w-4" />
                          <span>Edit </span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </tr>
                // );
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default CompaniesTable;
