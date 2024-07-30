const ProvinceModel = require('../Model/ProvinceModel')
const getProvince = async (req, res) => {
    try {
        const provincesData = await ProvinceModel.find({}, {
            _id: 0,
            'province.idProvince': 1,
            'province.name': 1,
            'province.deleted': 1
        });
        const filteredProvinces = provincesData.flatMap(doc =>
            doc.province.filter(prov => prov.deleted === false)
        );

        res.status(200).json({ success: true, data: filteredProvinces });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const addProvince = async (req, res) => {
    const { name, shippingFee } = req.body;

    try {
        const provincesData = await ProvinceModel.find({}, { 'province.idProvince': 1, _id: 0 });
        const existingIds = provincesData.flatMap(doc => doc.province.map(p => parseInt(p.idProvince, 10)));
        const maxIdProvince = existingIds.length ? Math.max(...existingIds) : 0;
        const newIdProvince = (maxIdProvince + 1).toString().padStart(2, "0");
        const updatedProvince = await ProvinceModel.updateOne(
            {},
            { $push: { province: { idProvince: newIdProvince, name, shippingFee, deleted: false } } },
            { upsert: true }
        );

        if (updatedProvince.nModified === 0 && updatedProvince.upserted === undefined) {
            return res.status(500).json({ success: false, message: 'Lỗi khi thêm tỉnh' });
        }

        res.status(201).json({ success: true, message: 'Thêm tỉnh thành công', idProvince: newIdProvince });
    } catch (error) {
        console.error('Lỗi khi thêm tỉnh:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm tỉnh', error });
    }
};

const updateProvince = async (req, res) => {
    const { idProvince } = req.params;
    const { name, shippingFee } = req.body;

    try {
        const updatedProvince = await ProvinceModel.updateOne(
            { 'province.idProvince': idProvince },
            { $set: { 'province.$.name': name, 'province.$.shippingFee': shippingFee } }
        );
        if (updatedProvince.nModified === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tỉnh' });
        }
        res.status(200).json({ success: true, message: 'Sửa tỉnh thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi sửa tỉnh', error });
    }
}
const deleteProvince = async (req, res) => {
    const { idProvince } = req.params;

    try {
        const updatedProvince = await ProvinceModel.updateOne(
            { 'province.idProvince': idProvince },
            { $set: { 'province.$.deleted': true } }
        );

        if (updatedProvince.nModified === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tỉnh' });
        }

        res.status(200).json({ message: 'Xóa tỉnh thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa tỉnh:', error);
        res.status(500).json({ message: 'Lỗi khi xóa tỉnh', error });
    }
};
const getAllProvince = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    try {

        const provincesData = await ProvinceModel.find({}, {
            _id: 0,
            province: 1
        });


        const provincesList = provincesData.flatMap(doc =>
            doc.province.filter(prov => prov.deleted === false)
        );


        const paginatedProvinces = provincesList.slice(skip, skip + limitNumber);
        const totalProvinces = provincesList.length;
        const totalPages = Math.ceil(totalProvinces / limitNumber);

        res.status(200).json({
            success: true,
            data: paginatedProvinces,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalProvinces,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tỉnh', error });
    }
};


const searchProvinces = async (req, res) => {
    const { page = 1, limit = 10, name } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let filter = { 'province.deleted': { $ne: true } };

    if (name) {
        filter['province.name'] = { $regex: new RegExp(name, 'i') };
    }

    try {

        const provincesData = await ProvinceModel.aggregate([
            { $unwind: "$province" },
            { $match: filter },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limitNumber },
                        {
                            $project: {
                                'province': 1,
                                _id: 0
                            }
                        }
                    ],
                    total: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const provincesList = provincesData[0].data.map(doc => doc.province);
        const totalProvinces = provincesData[0].total[0] ? provincesData[0].total[0].count : 0;
        const totalPages = Math.ceil(totalProvinces / limitNumber);

        res.status(200).json({
            success: true,
            data: provincesList,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalProvinces,
        });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm tỉnh:', error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm tỉnh', error });
    }
};




const getProvinceById = async (req, res) => {
    const { idProvince } = req.params;

    try {
        const province = await ProvinceModel.findOne(
            { 'province.idProvince': idProvince },
            { 'province.$': 1 }
        );
        if (!province || !province.province || !province.province.length) {
            return res.status(404).json({ message: 'Không tìm thấy tỉnh' });
        }

        res.status(200).json(province.province[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy tỉnh', error });
    }
};



const addDistrict = async (req, res) => {
    const { idProvince } = req.params;
    const { name } = req.body;
    if (!idProvince || !name) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {

        const districtData = await ProvinceModel.find({}, { 'district.idDistrict': 1, _id: 0 });
        const existingIds = districtData.flatMap(doc => doc.district.map(p => parseInt(p.idDistrict, 10)));
        const maxIdProvince = existingIds.length ? Math.max(...existingIds) : 0;
        const newIdProvince = (maxIdProvince + 1).toString().padStart(3, "0");
        const updatedProvince = await ProvinceModel.updateOne(
            { 'province.idProvince': idProvince },
            { $push: { district: { idProvince, idDistrict: newIdProvince, name } } }
        );

        if (updatedProvince.nModified === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tỉnh/thành phố' });
        }

        res.status(201).json({ success: true, message: 'Thêm huyện/thành phố trực thuộc thành công', idDistrict: newIdProvince });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm huyện/thành phố trực thuộc' });
    }
};
const updateDistrict = async (req, res) => {
    const { idDistrict } = req.params;
    const { name } = req.body;
    if (!idDistrict || !name) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const updatedProvince = await ProvinceModel.findOneAndUpdate(
            { 'district.idDistrict': idDistrict },
            { $set: { 'district.$.name': name } },
            { new: true }
        );

        if (!updatedProvince) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy huyện/thành phố trực thuộc' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật huyện/thành phố trực thuộc thành công' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật huyện/thành phố trực thuộc' });
    }
};
const getDistrictById = async (req, res) => {
    const { idDistrict } = req.params;

    if (!idDistrict) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const province = await ProvinceModel.findOne(
            { 'district.idDistrict': idDistrict },
            { _id: 0, 'district.$': 1 }
        );
        if (!province || !province.district || province.district.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy huyện/thành phố trực thuộc' });
        }
        res.status(200).json({ success: true, data: province.district[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin huyện/thành phố trực thuộc' });
    }
};
const deleteDistrict = async (req, res) => {
    const { idDistrict } = req.params;

    if (!idDistrict) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const updatedProvince = await ProvinceModel.updateOne(
            { 'district.idDistrict': idDistrict },
            { $set: { 'district.$.deleted': true } },
            { new: true }
        );

        if (!updatedProvince) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy huyện/thành phố trực thuộc' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái xóa huyện/thành phố trực thuộc thành công' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái xóa huyện/thành phố trực thuộc' });
    }
};

const getDistrictsByProvince = async (req, res) => {
    const { idProvince } = req.params;
    try {
        const province = await ProvinceModel.findOne(
            { 'district.idProvince': idProvince },
            { _id: 0, 'district.idProvince': 1, 'district.idDistrict': 1, 'district.name': 1, 'district.deleted': 1 }
        );
        if (!province) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy tỉnh/thành phố' });
        }
        const districts = province.district.filter(district => district.idProvince === idProvince && !district.deleted);
        res.status(200).json({ success: true, data: districts });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


const getCommunesByDistrict = async (req, res) => {
    const { idDistrict } = req.params;
    try {
        const district = await ProvinceModel.findOne(
            { 'commune.idDistrict': idDistrict },
            { _id: 0, 'commune.idDistrict': 1, 'commune.idCommune': 1, 'commune.name': 1, 'commune.deleted': 1 }
        );
        if (!district) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy quận/huyện' });
        }
        const communes = district.commune.filter(commune => commune.idDistrict === idDistrict && !commune.deleted);
        res.status(200).json({ success: true, data: communes });
    } catch (error) {
        console.error('Loi ne:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};




const addCommune = async (req, res) => {
    const {idDistrict} = req.params
    const {  name } = req.body;

    if (!idDistrict || !name) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const communeData = await ProvinceModel.find({}, { 'commune.idCommune': 1, _id: 0 });


        const existingIds = communeData
            .flatMap(doc => doc.commune.map(p => p.idCommune))
            .filter(id => /^[0-9]+$/.test(id))
            .map(id => parseInt(id, 10));


        const maxIdCommune = existingIds.length ? Math.max(...existingIds) : 0;


        const newIdCommune = (maxIdCommune + 1).toString().padStart(5, "0");


        await ProvinceModel.updateOne(
            { 'district.idDistrict': idDistrict },
            { $push: { commune: { idDistrict, idCommune: newIdCommune, name, deleted: false } } },
            { upsert: true }
        );

        res.status(201).json({ success: true, message: 'Thêm xã/phường thành công', idCommune: newIdCommune });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm xã/phường', error });
    }
};

const updateCommune = async (req, res) => {
    const { idCommune } = req.params;
    const { name } = req.body;

    if (!idCommune || !name) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const updatedDistrict = await ProvinceModel.findOneAndUpdate(
            { 'commune.idCommune': idCommune },
            { $set: { 'commune.$.name': name } },
            { new: true }
        );

        if (!updatedDistrict) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xã/phường trực thuộc' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật xã/phường trực thuộc thành công' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật xã/phường trực thuộc' });
    }
};
const deleteCommune = async (req, res) => {
    const { idCommune } = req.params;

    if (!idCommune) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const updatedDistrict = await ProvinceModel.findOneAndUpdate(
            { 'commune.idCommune': idCommune },
            { $set: { 'commune.$.deleted': true } },
            { new: true }
        );

        if (!updatedDistrict) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xã/phường trực thuộc' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái xóa xã/phường trực thuộc thành công' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái xóa xã/phường trực thuộc' });
    }
};
const getCommuneById = async (req, res) => {
    const { idCommune } = req.params;

    if (!idCommune) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const district = await ProvinceModel.findOne(
            { 'commune.idCommune': idCommune },
            { _id: 0, 'commune.$': 1 }
        );
        if (!district || !district.commune || district.commune.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xã/phường trực thuộc' });
        }
        res.status(200).json({ success: true, data: district.commune[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin xã/phường trực thuộc' });
    }
};
const getShippingFeeByProvinceName = async (req, res) => {
    const { provinceName } = req.body;

    if (!provinceName) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên tỉnh' });
    }

    try {
        const provinceData = await ProvinceModel.findOne(
            { 'province.name': provinceName, 'province.deleted': false },
            {
                _id: 0,
                'province.$': 1 
            }
        );

        if (!provinceData || !provinceData.province || provinceData.province.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tỉnh' });
        }

        const province = provinceData.province[0]; 
        const shippingFee = province.shippingFee; 

        res.status(200).json({
            success: true,
            data: {
                name: province.name,
                shippingFee: shippingFee
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy phí vận chuyển', error });
    }
};




module.exports = { getShippingFeeByProvinceName,searchProvinces, addProvince, deleteProvince, getProvince, getDistrictsByProvince, getCommunesByDistrict, updateProvince, getAllProvince, getProvinceById, addDistrict, updateDistrict, deleteDistrict, getDistrictById, addCommune, updateCommune, deleteCommune, getCommuneById };